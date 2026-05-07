'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function BlackFooter() {
  return (
    <footer className="bg-black border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
        >
          <div>
            <p className="font-display italic text-3xl sm:text-4xl text-white tracking-tight">
              Lumina<span className="not-italic text-accent">.</span>
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Avant-garde gastronomy · Copenhagen
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <Link
              href="/contact"
              data-cursor="interactive"
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                border border-zinc-700 hover:border-accent
                text-xs uppercase tracking-[0.22em] text-zinc-300 hover:text-accent
                transition-colors
              "
            >
              Full contact &amp; address
            </Link>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-600">
              © {new Date().getFullYear()} Atelier Lumina
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
