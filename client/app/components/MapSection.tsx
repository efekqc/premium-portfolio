'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar } from 'lucide-react';

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MapSection() {
  return (
    <section
      id="location"
      data-snap
      aria-label="Visit us"
      className="relative bg-ink-800 py-24 sm:py-32 px-5 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid lg:grid-cols-12 gap-10 mb-12 sm:mb-16 items-end"
        >
          <div className="lg:col-span-7">
            <motion.div
              variants={RISE}
              className="flex items-center gap-3 mb-5"
            >
              <span className="block h-px w-10 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Visit
              </span>
            </motion.div>
            <motion.h2
              variants={RISE}
              className="font-display font-light text-balance text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight text-zinc-50"
            >
              Refshalevej, <span className="italic text-accent">Copenhagen</span>
              .
            </motion.h2>
            <motion.p
              variants={RISE}
              className="mt-5 text-base text-zinc-400 max-w-md"
            >
              A short ride across the harbour from the city centre — or
              twenty minutes by water taxi from Nyhavn.
            </motion.p>
          </div>

          <motion.div
            variants={RISE}
            className="lg:col-span-5 grid sm:grid-cols-3 lg:grid-cols-1 gap-4"
          >
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              value="Refshalevej 169B"
              sub="2300 Copenhagen S"
            />
            <InfoRow
              icon={<Clock className="h-4 w-4" />}
              label="Hours"
              value="Tue — Sat"
              sub="18:00 & 21:00 seatings"
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Booking"
              value="hello@atelierlumina.studio"
            />
          </motion.div>
        </motion.div>

        {/* Interactive Google Maps embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="
            relative rounded-2xl overflow-hidden
            ring-1 ring-white/[0.06]
            shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]
            aspect-[16/9] sm:aspect-[21/9]
            bg-ink-800
          "
        >
          <iframe
            title="Atelier Lumina — Refshalevej 169B, Copenhagen"
            src="https://maps.google.com/maps?q=Refshalevej%20169B%2C%20Copenhagen&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[40%] contrast-95"
            allowFullScreen
          />

          {/* Floating address card on the map */}
          <div className="hidden md:block absolute top-6 left-6 max-w-[280px] bg-ink-950/85 backdrop-blur-md ring-1 ring-white/10 rounded-xl p-5 pointer-events-none">
            <p className="font-display italic text-2xl text-white">
              Lumina<span className="not-italic text-accent">.</span>
            </p>
            <p className="mt-2 text-xs text-zinc-300">
              Refshalevej 169B
              <br />
              2300 Copenhagen S
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Booking by email only
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-600 text-zinc-400">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
          {label}
        </p>
        <p className="text-sm text-zinc-100 font-medium truncate">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
