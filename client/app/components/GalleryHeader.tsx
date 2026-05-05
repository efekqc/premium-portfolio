'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  title: string;
  eyebrow?: string;
  count: number;
  right?: ReactNode;
}

export function GalleryHeader({ title, eyebrow, count, right }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.08,
          },
        },
      }}
      className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
    >
      <div className="min-w-0">
        {eyebrow && (
          <motion.div variants={item} className="flex items-center gap-3 mb-3">
            <span className="block h-px w-8 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              {eyebrow}
            </span>
          </motion.div>
        )}

        <motion.h2
          variants={item}
          className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-zinc-50 tracking-tight leading-[1.05]"
        >
          {title}
          <span className="text-accent">.</span>
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-3 text-sm text-zinc-500 tabular-nums"
        >
          {count} {count === 1 ? 'image' : 'images'} · scroll to explore
        </motion.p>
      </div>

      {right && <motion.div variants={item}>{right}</motion.div>}
    </motion.div>
  );
}
