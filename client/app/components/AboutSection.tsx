'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface BgSlide {
  src: string;
  alt: string;
}

interface Props {
  slides?: BgSlide[];
}

const SLIDE_INTERVAL = 5500;

export function AboutSection({ slides = [] }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [slides.length, prefersReducedMotion]);

  return (
    <section
      id="about"
      data-snap
      aria-label="About Atelier Lumina"
      className="relative isolate overflow-hidden"
    >
      {/* Crossfading background images */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-ink-950">
        <AnimatePresence>
          {slides.map((slide, i) =>
            i === index ? (
              <motion.div
                key={`${slide.src}-${i}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{
                  opacity: 1,
                  scale: prefersReducedMotion ? 1 : 1.12,
                }}
                exit={{ opacity: 0, transition: { duration: 1.2 } }}
                transition={{
                  opacity: { duration: 1.4, ease: 'easeOut' },
                  scale: { duration: 8, ease: 'linear' },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-r from-ink-950/95 via-ink-950/75 to-ink-950/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-noise opacity-[0.05] mix-blend-overlay"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-28 sm:py-36 lg:py-48">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="max-w-2xl"
        >
          <motion.div
            variants={ROW}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block h-px w-10 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              Our Philosophy
            </span>
          </motion.div>

          <motion.h2
            variants={ROW}
            className="
              font-sans font-medium text-zinc-50 text-balance
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              leading-[1.02] tracking-tight
            "
          >
            Authentic Flavors,{' '}
            <span className="text-accent">composed with light.</span>
          </motion.h2>

          <motion.p
            variants={ROW}
            className="mt-8 text-base sm:text-lg leading-relaxed text-zinc-300 max-w-xl"
          >
            Atelier Lumina is an experimental gastronomy studio set in a
            converted Copenhagen shipyard — a 14-seat tasting room where
            chefs, ceramicists, and machine-vision researchers collaborate
            on edible architecture.
          </motion.p>

          <motion.p
            variants={ROW}
            className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-xl"
          >
            Every menu is designed in light first, on plate second. Fire,
            fermentation, and latent space converge across twelve courses,
            served twice nightly to those who book ahead.
          </motion.p>

          <motion.div variants={ROW} className="mt-12">
            <MagneticButton
              as="a"
              href="/contact"
              className="
                group inline-flex items-center justify-center gap-2
                px-6 py-3.5 rounded-full
                bg-white text-ink-950 font-medium text-sm
                hover:bg-accent transition-colors
              "
            >
              About the studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const ROW = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};
