'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const STAGGER = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const RISE = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Subtle parallax — content rises into view as the footer becomes visible
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const innerY = useTransform(scrollYProgress, [0, 1], ['10%', '0%']);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={STAGGER}
      className="
        relative isolate
        overflow-hidden
        bg-ink-900
        text-zinc-200
        px-5 sm:px-8 lg:px-16
        pt-24 sm:pt-32 lg:pt-40
        pb-10
      "
      aria-labelledby="footer-heading"
    >
      {/* Background flourish */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_at_bottom,_rgba(233,213,161,0.08),_transparent_60%)]
        "
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-noise opacity-[0.04] mix-blend-overlay"
      />

      <motion.div
        style={prefersReducedMotion ? undefined : { y: innerY }}
        className="relative mx-auto max-w-6xl"
      >
        <h2 id="footer-heading" className="sr-only">
          Atelier Lumina — contact
        </h2>

        {/* Top row: blurb + contact */}
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12">
          <motion.div variants={RISE} className="lg:col-span-7 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Atelier · Lumina
              </span>
            </div>

            <p className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-zinc-50 leading-[1.1] tracking-tight">
              An <span className="italic text-accent">experimental</span>{' '}
              gastronomy studio, built around{' '}
              <span className="italic text-accent">light</span> as ingredient.
            </p>

            <p className="mt-8 text-base text-zinc-400 leading-relaxed max-w-md">
              A 14-seat tasting room in Copenhagen where chefs, ceramicists,
              and machine-vision researchers collaborate on edible architecture
              — fire, fermentation, and latent space, plated.
            </p>
          </motion.div>

          <motion.div variants={RISE} className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500 mb-6">
              Contact &amp; bookings
            </p>

            <ul className="space-y-5">
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="hello@atelierlumina.studio"
                href="mailto:hello@atelierlumina.studio"
              />
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label="Telephone"
                value="+45 71 23 45 67"
                href="tel:+4571234567"
              />
              <ContactRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value="Refshalevej 169B"
                sub="2300 Copenhagen S, Denmark"
              />
            </ul>

            <div className="mt-10 pt-8 border-t border-ink-700">
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
                Hours
              </p>
              <p className="text-sm text-zinc-300">
                Tuesday — Saturday
                <span className="block text-zinc-500 mt-1">
                  Seatings at 18:00 &amp; 21:00 · booking by email only
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Wordmark — large reveal */}
        <motion.div
          variants={RISE}
          style={
            prefersReducedMotion
              ? undefined
              : { scale: wordmarkScale, opacity: wordmarkOpacity }
          }
          className="mt-24 sm:mt-32 lg:mt-40"
        >
          <div className="hairline mb-10" />
          <p
            aria-hidden
            className="
              font-display font-light italic text-zinc-50
              text-[clamp(3.5rem,16vw,14rem)]
              leading-[0.85] tracking-tightest-2
              -mb-3 sm:-mb-5 lg:-mb-7
            "
          >
            Lumina<span className="not-italic text-accent">.</span>
          </p>
        </motion.div>

        {/* Bottom strip */}
        <motion.div
          variants={RISE}
          className="
            mt-12 pt-6 border-t border-ink-700
            flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500
          "
        >
          <span>© {new Date().getFullYear()} Atelier Lumina · Copenhagen</span>
          <span className="inline-flex items-center gap-2">
            Synthetic and original imagery, presented with intent.
          </span>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}

function ContactRow({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-600 text-zinc-400 group-hover:border-accent group-hover:text-accent transition-colors">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-0.5">
          {label}
        </span>
        <span className="block text-sm sm:text-base text-zinc-100 font-medium truncate">
          {value}
        </span>
        {sub && (
          <span className="block text-xs text-zinc-500 mt-0.5">{sub}</span>
        )}
      </span>
      {href && (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-accent transition-colors" />
      )}
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          data-cursor="interactive"
          className="group flex items-center gap-4 -mx-2 px-2 py-1.5 rounded-md hover:bg-ink-800/60 transition-colors"
        >
          {inner}
        </a>
      ) : (
        <div className="group flex items-center gap-4 px-0 py-1.5">{inner}</div>
      )}
    </li>
  );
}
