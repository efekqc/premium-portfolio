'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, GripHorizontal } from 'lucide-react';
import type { CarouselItem } from './CarouselSection';
import { MagneticButton } from './MagneticButton';
import { PersianTexture } from './PersianTexture';

const CARD_WIDTH = 360;
const CARD_GAP = 16;
const AUTOPLAY_MS = 3500;

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CarouselAboutPromo({ items }: { items: CarouselItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [trackX, setTrackX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    function measure() {
      if (!containerRef.current || !trackRef.current) return;
      const w = trackRef.current.scrollWidth - containerRef.current.offsetWidth;
      setDragWidth(Math.max(0, w));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items.length]);

  /**
   * Auto-advance every AUTOPLAY_MS, pausing on hover, touch, or active
   * drag.  Loops back to 0 once the track has been fully traversed.
   * Disabled when the user prefers reduced motion or the carousel
   * already fits the viewport (dragWidth === 0).
   */
  useEffect(() => {
    if (prefersReducedMotion || isPaused || dragWidth === 0) return;
    const id = setInterval(() => {
      setTrackX((curr) => {
        const next = curr - (CARD_WIDTH + CARD_GAP);
        // Past the end → snap back to start.  framer-motion will animate
        // the swing back via the existing spring transition.
        return next < -dragWidth ? 0 : next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, dragWidth, prefersReducedMotion]);

  function step(direction: 1 | -1) {
    const delta = (CARD_WIDTH + CARD_GAP) * direction;
    setTrackX((v) => Math.min(0, Math.max(-dragWidth, v - delta)));
  }

  return (
    <section
      data-snap
      aria-label="Inside the studio"
      className="relative isolate overflow-hidden bg-ink-800"
    >
      <PersianTexture />

      {/* CAROUSEL ON TOP */}
      <div
        ref={containerRef}
        className="relative overflow-hidden pt-20 sm:pt-28 pb-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        <motion.div
          ref={trackRef}
          drag={prefersReducedMotion ? false : 'x'}
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 280, bounceDamping: 32 }}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={(_, info) => {
            // Sync trackX to the dragged-to position so the next auto-tick
            // continues from where the user let go, then resume after a
            // short settle.
            const next = trackX + info.offset.x;
            setTrackX(Math.min(0, Math.max(-dragWidth, next)));
            setTimeout(() => setIsPaused(false), 800);
          }}
          animate={prefersReducedMotion ? undefined : { x: trackX }}
          transition={{ type: 'spring', stiffness: 220, damping: 30 }}
          className="flex gap-4 px-5 sm:px-8 lg:px-12 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {items.map((item, i) => (
            <motion.figure
              key={`${item.src}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(i * 0.05, 0.3),
              }}
              whileHover={{ y: -4 }}
              className="
                group relative shrink-0
                w-[260px] sm:w-[320px] lg:w-[360px]
                aspect-[4/5] rounded-2xl overflow-hidden
                ring-1 ring-accent/15
              "
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
                className="
                  object-cover pointer-events-none select-none
                  transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.07]
                "
                draggable={false}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent pointer-events-none"
              />
            </motion.figure>
          ))}
        </motion.div>

        {/* Mobile drag hint */}
        <div className="md:hidden mt-3 px-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          <GripHorizontal className="h-3 w-3" />
          Swipe to explore
        </div>
      </div>

      {/* ONE unified text block + About CTA below */}
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 pt-6 pb-24 sm:pb-32 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={RISE}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="block h-px w-10 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              Inside the Studio
            </span>
            <span className="block h-px w-10 bg-accent" />
          </motion.div>

          <motion.h2
            variants={RISE}
            className="
              font-display font-light text-balance
              text-3xl sm:text-4xl md:text-5xl
              leading-[1.05] tracking-tight text-zinc-50
            "
          >
            Where <span className="italic text-accent">fire, fermentation</span>,
            and quiet hours converge.
          </motion.h2>

          <motion.p
            variants={RISE}
            className="mt-5 text-base text-zinc-400 leading-relaxed max-w-xl mx-auto"
          >
            A 14-seat experimental kitchen in Copenhagen. Chefs, ceramicists,
            and machine-vision researchers, sharing one open kitchen and one
            tasting menu per evening.
          </motion.p>

          <motion.div variants={RISE} className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticButton
              as="a"
              href="/about"
              className="
                group inline-flex items-center justify-center gap-2
                px-6 py-3.5 rounded-full
                bg-sand-100 text-ink-800 font-medium text-sm
                hover:bg-sand-200 hover:scale-[1.02]
                transition-all duration-300
              "
            >
              About the Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            {/* Step buttons (desktop) */}
            <div className="hidden md:flex items-center gap-2 ml-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous"
                disabled={trackX >= 0}
                className="
                  inline-flex h-11 w-11 items-center justify-center rounded-full
                  border border-accent/25 text-zinc-300
                  hover:border-accent hover:bg-accent hover:text-ink-950 hover:scale-[1.03]
                  disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-300
                  transition-all duration-300
                "
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next"
                disabled={trackX <= -dragWidth}
                className="
                  inline-flex h-11 w-11 items-center justify-center rounded-full
                  border border-accent/25 text-zinc-300
                  hover:border-accent hover:bg-accent hover:text-ink-950 hover:scale-[1.03]
                  disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-300
                  transition-all duration-300
                "
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
