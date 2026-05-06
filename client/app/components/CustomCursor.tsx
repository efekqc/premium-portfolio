'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor="interactive"], input, textarea, select, label';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Soft spring for the outer ring; tighter spring for the dot.
  const ringX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 600, damping: 32, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 600, damping: 32, mass: 0.2 });

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
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isInteractive ? 64 : 32,
            height: isInteractive ? 64 : 32,
            borderColor: isInteractive
              ? 'rgba(233, 213, 161, 0.95)'
              : 'rgba(244, 244, 245, 0.4)',
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border mix-blend-difference"
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isInteractive ? 0 : 1,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="h-1.5 w-1.5 rounded-full bg-accent mix-blend-difference"
        />
      </motion.div>
    </>
  );
}
