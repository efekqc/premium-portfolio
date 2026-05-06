'use client';

import { forwardRef, useRef, type MouseEvent, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  /** Magnet strength (0-1). 0.25 = pull a quarter of the cursor offset. */
  strength?: number;
  /** Wraps an `<a>` (with href) or a `<button>` (default). */
  as?: 'a' | 'button';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

/**
 * Wrapper that pulls its child slightly toward the mouse on hover.
 * Built on Framer Motion springs for a soft, premium feel.
 */
export const MagneticButton = forwardRef<HTMLDivElement, Props>(
  function MagneticButton(
    {
      children,
      className,
      strength = 0.3,
      as = 'button',
      href,
      onClick,
      type = 'button',
      ariaLabel,
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? localRef) as React.RefObject<HTMLDivElement>;
    const prefersReducedMotion = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

    function handleMove(e: MouseEvent<HTMLDivElement>) {
      if (prefersReducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      x.set(mx * strength);
      y.set(my * strength);
    }

    function handleLeave() {
      x.set(0);
      y.set(0);
    }

    const inner =
      as === 'a' ? (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={className}
          data-cursor="interactive"
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          aria-label={ariaLabel}
          className={className}
          data-cursor="interactive"
        >
          {children}
        </button>
      );

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: springX, y: springY }}
        className="inline-block"
      >
        {inner}
      </motion.div>
    );
  },
);
