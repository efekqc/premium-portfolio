'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor="interactive"], input, textarea, select, label';

/**
 * Two-layer cursor — earthy terracotta dot with a thin sage outer ring.
 *
 * Performance:
 *   - No `mix-blend-mode` (was the main cause of paint lag).
 *   - Both layers are positioned with framer-motion's transform-only motion
 *     values; we add `willChange: 'transform'` so the compositor keeps each
 *     layer on its own GPU layer (translate3d under the hood).
 *   - The dot uses a tighter spring for snap; the ring lags slightly for
 *     a soft, breathable trail.
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 700, damping: 32, mass: 0.18 });
  const dotY = useSpring(y, { stiffness: 700, damping: 32, mass: 0.18 });

  useEffect(() => {
    setMounted(true);
    const fineMq = window.matchMedia('(pointer: fine)');
    if (!fineMq.matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (isHidden) setIsHidden(false);
      const target = e.target as Element | null;
      const interactive = !!target?.closest(INTERACTIVE_SELECTOR);
      setIsInteractive(interactive);
    };

    const onLeave = () => setIsHidden(true);
    const onEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [x, y, isHidden]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer ring — thin, sage-tinted */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
      >
        <motion.div
          animate={{
            width: isInteractive ? 44 : 26,
            height: isInteractive ? 44 : 26,
            opacity: isHidden ? 0 : isInteractive ? 0.95 : 0.55,
            borderColor: isInteractive
              ? 'rgba(193, 107, 80, 0.95)'
              : 'rgba(218, 213, 196, 0.55)',
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border"
          style={{ borderWidth: '1px', willChange: 'width, height, opacity' }}
        />
      </motion.div>

      {/* Inner dot — terracotta */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
      >
        <motion.div
          animate={{
            scale: isInteractive ? 0.4 : 1,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="h-2 w-2 rounded-full bg-accent"
          style={{ willChange: 'transform, opacity' }}
        />
      </motion.div>
    </>
  );
}
