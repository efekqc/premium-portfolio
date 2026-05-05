'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Camera, Play } from 'lucide-react';
import Link from 'next/link';

/**
 * Full-bleed hero. Mobile-first; expands gracefully to wide viewports.
 *
 * Background slot uses a placeholder gradient + noise; swap in a <video> or
 * <Image> when assets land. Comments mark the swap point.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // Stagger children so eyebrow → headline → subhead → CTAs reveal in sequence.
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      className="
        relative isolate
        min-h-[100svh] w-full
        flex items-center
        overflow-hidden
        px-5 sm:px-8 lg:px-16
      "
      aria-label="Introduction"
    >
      {/* ---- Background layer ----------------------------------------------
          Replace this <div> with a <video> tag (autoPlay, muted, playsInline,
          loop) or a Next/Image fill when the asset is ready. Keep the overlay
          gradients below — they ensure text legibility regardless of media.
          ------------------------------------------------------------------- */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-20
          bg-[radial-gradient(ellipse_at_top,_#1d1d24,_#0a0a0b_60%)]
        "
      >
        {/* TODO(asset): drop in <video src="/hero.mp4" .../> here */}
      </div>

      {/* Subtle film-grain noise to add texture over flat gradients */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-noise opacity-[0.05] mix-blend-overlay"
      />

      {/* Bottom-fade for content legibility regardless of background asset */}
      <div
        aria-hidden
        className="
          absolute inset-x-0 bottom-0 -z-10 h-2/3
          bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent
        "
      />

      {/* ---- Content ------------------------------------------------------- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="
          relative mx-auto w-full max-w-6xl
          py-24 sm:py-32 lg:py-40
        "
      >
        {/* Eyebrow */}
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400 font-medium">
            Photography · Synthetic · Mixed Media
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="
            mt-6 sm:mt-8
            font-display font-light text-balance
            text-5xl leading-[1.05] tracking-tightest-2
            sm:text-6xl
            md:text-7xl
            lg:text-[clamp(4.5rem,8vw,8rem)]
            text-zinc-50
          "
        >
          Light,{' '}
          <span className="italic text-accent">captured</span>
          <span className="text-accent">.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={item}
          className="
            mt-6 sm:mt-8 max-w-xl
            text-base sm:text-lg leading-relaxed text-zinc-400
            text-pretty
          "
        >
          A curated archive of moments — half observed through a lens,
          half coaxed from latent space. Browse by mood, not menu.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="
            mt-10 sm:mt-12
            flex flex-col sm:flex-row gap-3 sm:gap-4
          "
        >
          <Link
            href="/work"
            className="
              group inline-flex items-center justify-center gap-2
              px-6 py-3.5 sm:py-4
              rounded-full
              bg-accent text-ink-950 font-medium text-sm
              hover:bg-accent-muted transition-colors
              focus-visible:ring-2 focus-visible:ring-accent
            "
          >
            View the work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            className="
              group inline-flex items-center justify-center gap-2
              px-6 py-3.5 sm:py-4
              rounded-full
              border border-ink-600 hover:border-ink-500
              text-zinc-200 font-medium text-sm
              bg-ink-900/40 backdrop-blur-sm
              hover:bg-ink-800/60 transition-colors
            "
          >
            <Play className="h-4 w-4 fill-current" />
            Showreel
          </button>
        </motion.div>

        {/* Footer-row inside the hero — credibility / quick stats */}
        <motion.div
          variants={item}
          className="
            mt-16 sm:mt-24
            flex flex-wrap items-center gap-x-8 gap-y-3
            text-xs text-zinc-500
          "
        >
          <span className="inline-flex items-center gap-2">
            <Camera className="h-3.5 w-3.5" />
            Original &amp; synthetic
          </span>
          <span className="hidden sm:inline-block h-px w-8 bg-ink-600" />
          <span>Updated regularly</span>
          <span className="hidden sm:inline-block h-px w-8 bg-ink-600" />
          <span>No tracking, no popups</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue — pinned to the bottom on tall screens */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.4, duration: 0.8 }}
        className="
          absolute bottom-6 left-1/2 -translate-x-1/2
          hidden sm:flex flex-col items-center gap-2
          text-[10px] uppercase tracking-[0.3em] text-zinc-500
        "
      >
        <span>Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>
    </section>
  );
}
