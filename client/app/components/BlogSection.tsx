'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PersianTexture } from './PersianTexture';

interface Post {
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  date: string;
  category: string;
}

interface Props {
  pool: Array<{ src: string; alt: string }>;
}

const POSTS: Omit<Post, 'image' | 'alt'>[] = [
  {
    title: 'On Fermentation as Memory',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut metus eget sapien fermentum gravida. Notes on a winter program of three lacto-ferments and the rooms they were aged in.',
    date: '12 March 2026',
    category: 'Studio Notes',
  },
  {
    title: 'Twelve Courses, Plotted on a Curve',
    excerpt:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque. Designing a tasting menu as a temperature curve, not a list of ingredients.',
    date: '04 February 2026',
    category: 'Method',
  },
  {
    title: 'A Conversation with our Ceramicist',
    excerpt:
      'Vivamus blandit dignissim porta. Aliquam erat volutpat. Long-form interview on the difference between a plate that holds food and a plate that holds attention.',
    date: '20 January 2026',
    category: 'People',
  },
  {
    title: 'On the Walk-In and the Wild',
    excerpt:
      'Quisque vitae lacus eget purus consectetur efficitur. Two notebooks: one from a forager in Mols Bjerge, one from our line cook on Tuesday service.',
    date: '11 December 2025',
    category: 'Field Notes',
  },
];

const RISE = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function BlogSection({ pool }: Props) {
  const fallback = {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80',
    alt: 'Plate',
  };
  const posts: Post[] = POSTS.map((p, i) => {
    const img = pool[i % Math.max(1, pool.length)] ?? fallback;
    return { ...p, image: img.src, alt: img.alt };
  });

  return (
    <section
      id="journal"
      data-snap
      aria-label="Blog · Journal"
      className="relative isolate overflow-hidden bg-ink-800 py-28 sm:py-36 lg:py-44 px-5 sm:px-8 lg:px-12 scroll-mt-24"
    >
      <PersianTexture opacity={0.04} />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20"
        >
          <div>
            <motion.div variants={RISE} className="flex items-center gap-3 mb-4">
              <span className="block h-px w-10 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-zinc-400">
                Journal
              </span>
            </motion.div>
            <motion.h2
              variants={RISE}
              className="font-display font-light text-balance text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight text-zinc-50"
            >
              Notes from <span className="italic text-accent">the studio</span>
              <span className="text-accent">.</span>
            </motion.h2>
          </div>
          <motion.p
            variants={RISE}
            className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed"
          >
            Long-form essays, interviews, and field notes from our team. Published
            roughly monthly.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {posts.map((post, i) => (
            <BlogCard key={post.title} post={post} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, delay }: { post: Post; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className="group relative flex flex-col"
    >
      <Link href="#" className="flex flex-col h-full">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-accent/15">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="
              object-cover
              transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.07]
            "
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent"
          />
          <div
            className="
              absolute top-4 right-4 inline-flex items-center justify-center
              h-9 w-9 rounded-full bg-accent text-ink-950
              opacity-0 -translate-y-1
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-500
            "
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </figure>

        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-accent mb-2">
            {post.category} · {post.date}
          </p>
          <h3 className="font-display text-xl sm:text-2xl text-zinc-50 leading-tight tracking-tight group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
