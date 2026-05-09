'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { PersianTexture } from './PersianTexture';

interface Review {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    quote:
      'A tasting menu that reads like an essay on light. Each course felt like a small inhabited room.',
    name: 'Sofia Lindqvist',
    role: 'Food Writer · Apartamento',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80',
  },
  {
    quote:
      'The Adana with pomegranate glaze is now something I dream about. The whole evening was theatre, but quiet.',
    name: 'Henrik Volkov',
    role: 'Architect · Studio Volkov',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80',
  },
  {
    quote:
      'Lumina sits where research and pleasure overlap. I have not been moved by a meal like this in years.',
    name: 'Mira Tanaka',
    role: 'Curator · Louisiana Museum',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80',
  },
];

const RISE = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-label="Guest reviews"
      className="relative isolate overflow-hidden bg-ink-900 py-28 sm:py-36 lg:py-44 px-5 sm:px-8 lg:px-12"
    >
      {/* Photographic / textured background */}
      <div aria-hidden className="absolute inset-0 -z-30 opacity-[0.22]">
        <Image
          src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2200&q=70"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-ink-900/60 via-ink-900/85 to-ink-900"
      />
      {/* Persian motif on top of photo */}
      <PersianTexture className="-z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="text-center mb-20 sm:mb-24"
        >
          <motion.div
            variants={RISE}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="block h-px w-10 bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
              Guests Say
            </span>
            <span className="block h-px w-10 bg-accent" />
          </motion.div>
          <motion.h2
            variants={RISE}
            className="font-display font-light text-zinc-50 text-balance text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight"
          >
            In their <span className="italic text-accent">own words</span>
            <span className="text-accent">.</span>
          </motion.h2>
        </motion.div>

        {/* Cards — heavily rounded, solid muted bg */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {REVIEWS.map((review, i) => (
            <ReviewCard
              key={review.name}
              review={review}
              offsetClass={i === 1 ? 'md:translate-y-10 lg:translate-y-16' : ''}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 sm:mt-36 flex justify-center">
          <MagneticButton
            as="a"
            href="/contact"
            className="
              group inline-flex items-center justify-center gap-2
              px-7 py-4 rounded-full
              bg-sand-100 text-ink-800 font-medium text-sm
              hover:bg-sand-200 hover:scale-[1.03]
              transition-all duration-300
            "
          >
            Book Now
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  offsetClass,
  delay,
}: {
  review: Review;
  offsetClass?: string;
  delay: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={`
        relative
        bg-ink-800
        rounded-[2rem]
        border border-accent/15
        p-8 pb-16 sm:p-10 sm:pb-20
        shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]
        transition-shadow duration-500
        hover:shadow-[0_45px_90px_-30px_rgba(0,0,0,0.85)]
        hover:border-accent/35
        ${offsetClass ?? ''}
      `}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 text-accent"
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </div>

      <span
        aria-hidden
        className="absolute top-5 right-7 font-display italic text-7xl leading-none text-accent/25 select-none"
      >
        &ldquo;
      </span>

      <blockquote className="relative">
        <p className="text-base sm:text-lg text-zinc-100 leading-relaxed">
          {review.quote}
        </p>
      </blockquote>

      {/* Avatar — overlapping bottom edge */}
      <figcaption className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="group block h-[72px] w-[72px] rounded-full overflow-hidden ring-4 ring-ink-900 bg-ink-800">
          <Image
            src={review.avatar}
            alt={review.name}
            width={72}
            height={72}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </span>
      </figcaption>

      <div className="absolute -bottom-[5.5rem] left-0 right-0 text-center">
        <p className="text-sm font-medium text-white">{review.name}</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 mt-0.5">
          {review.role}
        </p>
      </div>
    </motion.figure>
  );
}
