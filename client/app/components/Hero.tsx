'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

export interface HeroSlide {
  src: string;
  alt: string;
  dominantColor?: string | null;
}

const SLIDE_INTERVAL = 6500;

export function Hero({ slides = [] }: { slides?: HeroSlide[] }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [slides.length, prefersReducedMotion]);

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.18,
        delayChildren: prefersReducedMotion ? 0 : 0.4,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate min-h-[100svh] w-full flex items-center justify-center overflow-hidden text-center px-5"
      aria-label="Atelier Lumina"
    >
      {/* ── Background slider — full-bleed top-down food imagery ────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={prefersReducedMotion ? undefined : { y: bgY, scale: bgScale }}
      >
        <div className="absolute inset-0 bg-ink-950" />
        <AnimatePresence>
          {slides.map((slide, i) =>
            i === slideIndex ? (
              <motion.div
                key={`${slide.src}-${i}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: 1,
                  scale: prefersReducedMotion ? 1 : 1.16,
                }}
                exit={{ opacity: 0, transition: { duration: 1.2 } }}
                transition={{
                  opacity: { duration: 1.6, ease: 'easeOut' },
                  scale: { duration: 9, ease: 'linear' },
                }}
                className="absolute inset-0"
                style={{ backgroundColor: slide.dominantColor ?? '#15151a' }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlays — slightly heavier so the centred wordmark reads cleanly */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-ink-950/70 via-ink-950/50 to-ink-950/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-radial-fade opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-noise opacity-[0.06] mix-blend-overlay"
      />

      {/* ── Content — dead-centred massive serif name ───────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={
          prefersReducedMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
        className="relative max-w-5xl"
      >
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="block h-px w-10 bg-accent/70" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-200">
            Atelier Lumina · Copenhagen
          </span>
          <span className="block h-px w-10 bg-accent/70" />
        </motion.div>

        <motion.h1
          variants={item}
          className="
            font-display font-light text-zinc-50
            text-[clamp(3.75rem,12vw,11rem)]
            leading-[0.92] tracking-tightest-2
          "
        >
          Atelier <span className="italic text-accent">Lumina</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 sm:mt-8 font-display italic text-xl sm:text-2xl md:text-3xl text-zinc-200"
        >
          Inspired by light. Plated with intent.
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 text-xs sm:text-sm uppercase tracking-[0.32em] text-zinc-400"
        >
          A 14-seat experimental tasting room
        </motion.p>
      </motion.div>

      {/* Slide pips */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlideIndex(i)}
              data-cursor="interactive"
              className={`h-px transition-all duration-700 ${
                i === slideIndex ? 'w-10 bg-accent' : 'w-5 bg-zinc-500'
              }`}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
