'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, GripHorizontal } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export interface CarouselItem {
  src: string;
  alt: string;
  caption?: string;
}

const CARD_WIDTH = 360; // px @ desktop
const CARD_GAP = 16;

export function CarouselSection({ items }: { items: CarouselItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [trackX, setTrackX] = useState(0);

  useEffect(() => {
    function measure() {
      if (!containerRef.current || !trackRef.current) return;
      const w =
        trackRef.current.scrollWidth - containerRef.current.offsetWidth;
      setDragWidth(Math.max(0, w));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items.length]);

  function step(direction: 1 | -1) {
    const delta = (CARD_WIDTH + CARD_GAP) * direction;
    const next = Math.min(0, Math.max(-dragWidth, trackX - delta));
    setTrackX(next);
  }

  return (
    <section
      aria-label="Inside the studio"
      className="relative bg-[#efe7da] text-ink-950 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-10 bg-ink-950/40" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-ink-700">
                Inside the Studio
              </span>
            </div>
            <h2 className="font-display font-light text-balance text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight text-ink-950">
              Spaces, plates, and the{' '}
              <span className="italic">
                quiet hours between
              </span>
              .
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="text-base sm:text-lg text-ink-700 leading-relaxed max-w-xl">
              A walk through the room — the open kitchen, the ceramics
              library, the table set for twelve. Drag to explore, then take a
              seat with the menu.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <MagneticButton
                as="a"
                href="#menu"
                onClick={() => {
                  document
                    .getElementById('menu')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="
                  group inline-flex items-center justify-center gap-2
                  px-6 py-3.5 rounded-full
                  bg-ink-950 text-white font-medium text-sm
                  hover:bg-ink-800 transition-colors
                "
              >
                View Menu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>

              {/* Step buttons (desktop) */}
              <div className="hidden md:flex items-center gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  data-cursor="interactive"
                  aria-label="Previous"
                  disabled={trackX >= 0}
                  className="
                    inline-flex h-11 w-11 items-center justify-center rounded-full
                    border border-ink-950/15
                    text-ink-950 hover:border-ink-950 hover:bg-ink-950 hover:text-white
                    disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-950
                    transition-colors
                  "
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  data-cursor="interactive"
                  aria-label="Next"
                  disabled={trackX <= -dragWidth}
                  className="
                    inline-flex h-11 w-11 items-center justify-center rounded-full
                    border border-ink-950/15
                    text-ink-950 hover:border-ink-950 hover:bg-ink-950 hover:text-white
                    disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-950
                    transition-colors
                  "
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag track */}
      <div
        ref={containerRef}
        data-cursor="interactive"
        className="relative overflow-hidden pb-24 sm:pb-32"
      >
        <motion.div
          ref={trackRef}
          drag={prefersReducedMotion ? false : 'x'}
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 280, bounceDamping: 32 }}
          animate={prefersReducedMotion ? undefined : { x: trackX }}
          transition={{ type: 'spring', stiffness: 220, damping: 30 }}
          className="flex gap-4 px-5 sm:px-8 lg:px-12 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {items.map((item, i) => (
            <CarouselCard key={`${item.src}-${i}`} item={item} index={i} />
          ))}
        </motion.div>

        {/* Drag affordance hint (mobile + first paint) */}
        <div className="md:hidden mt-4 px-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ink-700">
          <GripHorizontal className="h-3 w-3" />
          Swipe to explore
        </div>
      </div>
    </section>
  );
}

function CarouselCard({
  item,
  index,
}: {
  item: CarouselItem;
  index: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="
        relative shrink-0 w-[260px] sm:w-[320px] lg:w-[360px]
        aspect-[4/5] rounded-2xl overflow-hidden bg-ink-200
        ring-1 ring-ink-950/10
      "
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />
      {/* Soft inset gradient for depth */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent pointer-events-none"
      />
    </motion.figure>
  );
}
