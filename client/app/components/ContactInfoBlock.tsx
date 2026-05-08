'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { PersianTexture } from './PersianTexture';

const RISE = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactInfoBlock() {
  return (
    <section
      data-snap
      aria-label="Contact information"
      className="relative isolate overflow-hidden bg-ink-800 py-20 sm:py-28 px-5 sm:px-8 lg:px-12 scroll-mt-24"
    >
      <PersianTexture />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            variants={RISE}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="block h-px w-10 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              Visit &amp; Reserve
            </span>
            <span className="block h-px w-10 bg-accent" />
          </motion.div>
          <motion.h1
            variants={RISE}
            className="font-display font-light text-balance text-5xl sm:text-6xl md:text-7xl leading-[0.96] tracking-tightest-2 text-zinc-50"
          >
            Find us in <span className="italic text-accent">Refshalevej</span>
            <span className="text-accent">.</span>
          </motion.h1>
          <motion.p
            variants={RISE}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A short ride across the harbour from the city centre — or twenty
            minutes by water taxi from Nyhavn.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <InfoCard
            icon={<MapPin className="h-5 w-5" />}
            label="Address"
            primary="Refshalevej 169B"
            secondary="2300 Copenhagen S, Denmark"
          />
          <InfoCard
            icon={<Clock className="h-5 w-5" />}
            label="Hours"
            primary="Tuesday — Saturday"
            secondary="Seatings at 18:00 & 21:00"
          />
          <InfoCard
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            primary="hello@atelierlumina.studio"
            href="mailto:hello@atelierlumina.studio"
          />
          <InfoCard
            icon={<Phone className="h-5 w-5" />}
            label="Telephone"
            primary="+45 71 23 45 67"
            href="tel:+4571234567"
          />
        </div>

        <motion.div
          variants={RISE}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Follow
          </span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
            className="
              inline-flex h-10 w-10 items-center justify-center rounded-full
              border border-accent/25 text-zinc-300
              hover:border-accent hover:text-accent hover:bg-accent/10 hover:scale-[1.05]
              transition-all duration-300
            "
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Facebook"
            className="
              inline-flex h-10 w-10 items-center justify-center rounded-full
              border border-accent/25 text-zinc-300
              hover:border-accent hover:text-accent hover:bg-accent/10 hover:scale-[1.05]
              transition-all duration-300
            "
          >
            <Facebook className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  primary,
  secondary,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 text-accent group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
        {icon}
      </span>
      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-1.5">
          {label}
        </p>
        <p className="text-base sm:text-lg text-zinc-100 font-medium leading-snug break-words">
          {primary}
        </p>
        {secondary && (
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{secondary}</p>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      variants={RISE}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {href ? (
        <a
          href={href}
          className="
            block rounded-3xl border border-accent/15 bg-ink-900
            p-6 sm:p-7 h-full
            hover:border-accent/40 hover:bg-ink-900/80
            transition-colors duration-300
          "
        >
          {inner}
        </a>
      ) : (
        <div className="rounded-3xl border border-accent/15 bg-ink-900 p-6 sm:p-7 h-full">
          {inner}
        </div>
      )}
    </motion.div>
  );
}
