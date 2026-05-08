'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { PersianTexture } from './PersianTexture';

interface Props {
  /** Photographic background URL */
  bgImage: string;
  bgAlt: string;
}

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ReservationPromoSection({ bgImage, bgAlt }: Props) {
  return (
    <section
      data-snap
      aria-label="Reserve a table"
      className="relative isolate overflow-hidden min-h-[80vh] flex items-center"
    >
      {/* Photographic bg with Ken-Burns drift on hover-of-section */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-ink-950">
        <motion.div
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.06 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={bgImage}
            alt={bgAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Heavy darken — must NOT be solid black, but very dim */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950/90"
      />

      <PersianTexture opacity={0.05} className="-z-10" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 py-24 sm:py-32 text-center">
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
            <span className="text-[11px] uppercase tracking-[0.32em] text-accent">
              Bookings
            </span>
            <span className="block h-px w-10 bg-accent" />
          </motion.div>

          <motion.h2
            variants={RISE}
            className="
              font-display font-light text-balance
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              leading-[1.02] tracking-tight text-zinc-50
            "
          >
            A table for <span className="italic text-accent">two</span>,
            <br className="hidden sm:block" />
            for an evening of twelve.
          </motion.h2>

          <motion.p
            variants={RISE}
            className="mt-6 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed"
          >
            Seatings at 18:00 and 21:00, Tuesday through Saturday.
            Booking opens for the following month on the first of each month.
          </motion.p>

          <motion.div variants={RISE} className="mt-10 flex justify-center">
            <MagneticButton
              as="a"
              href="/contact"
              className="
                group inline-flex items-center justify-center gap-2
                px-7 py-4 rounded-full
                bg-accent text-ink-950 font-medium text-sm
                hover:bg-accent-muted hover:scale-[1.03]
                transition-all duration-300
              "
            >
              Reserve a Table
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
