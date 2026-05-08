'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { PersianTexture } from './PersianTexture';

interface Props {
  /** Featured food image (URL) */
  image: string;
  alt: string;
}

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MenuPromoSection({ image, alt }: Props) {
  return (
    <section
      data-snap
      aria-label="Tonight's menu"
      className="relative isolate overflow-hidden bg-ink-800"
    >
      {/* Subtle Persian motif behind the content */}
      <PersianTexture />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image — left */}
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-accent/15"
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="
                object-cover
                transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.06]
              "
            />
            {/* Hover scrim — soft warm vignette */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent opacity-80"
            />
            {/* Tag */}
            <span className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-950/70 backdrop-blur-sm text-[10px] uppercase tracking-[0.28em] text-accent">
              Featured · Tonight
            </span>
          </motion.figure>

          {/* Text — right */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={RISE}
              className="flex items-center gap-3 mb-5"
            >
              <span className="block h-px w-10 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Tonight&rsquo;s Selection
              </span>
            </motion.div>

            <motion.h2
              variants={RISE}
              className="
                font-display font-light text-balance
                text-4xl sm:text-5xl md:text-6xl
                leading-[1.05] tracking-tight text-zinc-50
              "
            >
              Twelve courses, <span className="italic text-accent">composed in light</span>.
            </motion.h2>

            <motion.p
              variants={RISE}
              className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg"
            >
              A small, considered list — soups, kebabs, pitas, and slow desserts
              shaped by the harvest from our partner farms in Sjælland. Refreshed
              weekly, served twice nightly.
            </motion.p>

            <motion.div variants={RISE} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton
                as="a"
                href="/menu"
                className="
                  group inline-flex items-center justify-center gap-2
                  px-6 py-3.5 rounded-full
                  bg-sand-100 text-ink-800 font-medium text-sm
                  hover:bg-sand-200 hover:scale-[1.02]
                  transition-all duration-300
                "
              >
                View Full Menu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
