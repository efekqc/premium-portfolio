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
import { ArrowRight, Camera, Play } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { ShowreelModal } from './ShowreelModal';

export interface HeroSlide {
  src: string;
  alt: string;
  dominantColor?: string | null;
}

/**
 * All concepts are aspects of Atelier Lumina — one cohesive avant-garde
 * gastronomy studio in Copenhagen.
 */
const CONCEPTS: Array<{ lead: string; accent: string }> = [
  { lead: 'A study in', accent: 'Synthetic Gastronomy' },
  { lead: 'A study in', accent: 'Culinary Architecture' },
  { lead: 'Tonight at', accent: 'The Tasting Room' },
  { lead: 'A study in', accent: 'Edible Sculpture' },
  { lead: 'A study in', accent: 'Heat as Medium' },
  { lead: 'A study in', accent: 'Negative Space' },
  { lead: 'Twelve courses of', accent: 'Light' },
];

const SLIDE_INTERVAL = 6000;
const CONCEPT_INTERVAL = 3800;

export function Hero({ slides = [] }: { slides?: HeroSlide[] }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [conceptIndex, setConceptIndex] = useState(0);
  const [showreelOpen, setShowreelOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;
    const id = setInterval(
      () => setSlideIndex((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [slides.length, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(
      () => setConceptIndex((i) => (i + 1) % CONCEPTS.length),
      CONCEPT_INTERVAL,
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
        delayChildren: prefersReducedMotion ? 0 : 0.4,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const concept = CONCEPTS[conceptIndex];
  const conceptKey = `${conceptIndex}-${concept.accent}`;

  function scrollToGallery() {
    const el = document.getElementById('gallery');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="
          relative isolate
          min-h-[100svh] w-full
          flex items-center
          overflow-hidden
          px-5 sm:px-8 lg:px-16
        "
        aria-label="Atelier Lumina — introduction"
      >
        {/* ── Background slider ──────────────────────────────────────────── */}
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
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{
                    opacity: 1,
                    scale: prefersReducedMotion ? 1 : 1.18,
                  }}
                  exit={{ opacity: 0, transition: { duration: 1.2 } }}
                  transition={{
                    opacity: { duration: 1.6, ease: 'easeOut' },
                    scale: { duration: 8.5, ease: 'linear' },
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

        {/* Overlays */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-b from-ink-950/85 via-ink-950/55 to-ink-950"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/30"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-noise opacity-[0.06] mix-blend-overlay"
        />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={
            prefersReducedMotion
              ? undefined
              : { y: contentY, opacity: contentOpacity }
          }
          className="relative mx-auto w-full max-w-6xl py-24 sm:py-32 lg:py-40"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-200 font-medium">
              Atelier Lumina · Copenhagen · Est. 2024
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 sm:mt-8 font-display font-light text-balance text-zinc-50 leading-[0.95] tracking-tightest-2"
          >
            <span className="block font-sans font-light text-zinc-300 text-3xl sm:text-4xl md:text-5xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`lead-${conceptKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block overflow-hidden"
                >
                  <RevealWord text={concept.lead} className="font-sans font-light text-zinc-300" />
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="mt-2 sm:mt-3 block text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(4.5rem,9vw,9rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`accent-${conceptKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex flex-wrap items-baseline gap-x-3 sm:gap-x-5"
                >
                  {concept.accent.split(' ').map((word, i) => (
                    <RevealWord
                      key={i}
                      text={word}
                      className="font-display italic text-accent"
                      delay={0.08 + i * 0.08}
                    />
                  ))}
                  <RevealWord
                    text="."
                    className="font-display text-accent"
                    delay={0.08 + concept.accent.split(' ').length * 0.08}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 sm:mt-10 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300 text-pretty"
          >
            A 14-seat experimental kitchen in Copenhagen — where chefs,
            ceramicists, and machine-vision researchers collaborate on
            edible architecture. Fire, fermentation, and latent space, plated.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5"
          >
            <MagneticButton
              onClick={scrollToGallery}
              className="
                group inline-flex items-center justify-center gap-2
                px-6 py-3.5 sm:py-4 rounded-full
                bg-accent text-ink-950 font-medium text-sm
                hover:bg-accent-muted transition-colors
                focus-visible:ring-2 focus-visible:ring-accent
              "
            >
              View the work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>

            <MagneticButton
              onClick={() => setShowreelOpen(true)}
              className="
                group inline-flex items-center justify-center gap-2
                px-6 py-3.5 sm:py-4 rounded-full
                border border-ink-500 hover:border-accent
                text-zinc-100 hover:text-accent font-medium text-sm
                bg-ink-900/40 backdrop-blur-sm
                hover:bg-ink-800/60 transition-colors
              "
            >
              <Play className="h-4 w-4 fill-current" />
              Showreel
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 sm:mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-zinc-300"
          >
            <span className="inline-flex items-center gap-2">
              <Camera className="h-3.5 w-3.5" />
              Original &amp; synthetic imagery
            </span>
            <span className="hidden sm:inline-block h-px w-8 bg-ink-500" />
            <span>Tuesday — Saturday · seatings 18:00 &amp; 21:00</span>
          </motion.div>
        </motion.div>

        {/* Slide pips */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 right-5 sm:right-12 z-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
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

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={scrollToGallery}
          aria-label="Scroll to gallery"
          data-cursor="interactive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1.6, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-300 hover:text-accent transition-colors"
        >
          <span>Scroll</span>
          <span className="block h-8 w-px bg-gradient-to-b from-current to-transparent" />
        </motion.button>
      </section>

      <ShowreelModal
        open={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        poster={slides[0]?.src}
      />
    </>
  );
}

function RevealWord({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden align-baseline ${className ?? ''}`}>
      <motion.span
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}
