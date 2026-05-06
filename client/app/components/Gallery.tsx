'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, ExternalLink, Sparkles, X } from 'lucide-react';
import {
  variantUrl,
  type CategoryRead,
  type ImageRead,
} from '@/lib/api';

interface Props {
  categories: CategoryRead[];
  images: ImageRead[];
  /** Initial filter from the URL — purely to seed client state. */
  initialCategorySlug?: string;
}

/**
 * Combined gallery: client-side category filter + framer-motion `layout`
 * grid + minimalist lightbox. The grid re-orders smoothly when the filter
 * changes; cards reveal as they enter the viewport and tilt in 3D on hover.
 */
export function Gallery({ categories, images, initialCategorySlug }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    initialCategorySlug ?? null,
  );
  const [selected, setSelected] = useState<ImageRead | null>(null);

  const filtered = useMemo(() => {
    if (!activeSlug) return images;
    return images.filter((i) => i.category.slug === activeSlug);
  }, [images, activeSlug]);

  // ESC + scroll-lock for the lightbox
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) =>
      e.key === 'Escape' && setSelected(null);
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
      />

      <LayoutGroup id="gallery-grid">
        <ul
          role="list"
          className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((image, i) => (
              <ImageCard
                key={image.id}
                image={image}
                index={i}
                onOpen={setSelected}
              />
            ))}
          </AnimatePresence>
        </ul>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="py-24 text-center text-sm text-zinc-500">
          No work in this category yet — try another.
        </p>
      )}

      <AnimatePresence>
        {selected && (
          <Lightbox image={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Filter pills with shared layoutId for the active background
// ---------------------------------------------------------------------------
function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: {
  categories: CategoryRead[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const pills: Array<{ label: string; slug: string | null }> = [
    { label: 'All', slug: null },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ];

  return (
    <LayoutGroup id="category-pills">
      <nav
        aria-label="Filter by category"
        className="flex flex-wrap gap-2 mb-10"
      >
        {pills.map(({ label, slug }) => {
          const isActive = slug === activeSlug;
          return (
            <button
              key={slug ?? '__all'}
              type="button"
              onClick={() => onSelect(slug)}
              aria-pressed={isActive}
              data-cursor="interactive"
              className={`
                relative inline-flex items-center
                px-4 py-1.5 rounded-full text-sm font-medium
                border border-ink-600
                transition-colors
                ${
                  isActive
                    ? 'text-ink-950'
                    : 'text-zinc-400 hover:text-zinc-200 hover:border-ink-500'
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                  }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}

// ---------------------------------------------------------------------------
// 3D tilt card
// ---------------------------------------------------------------------------
const TILT_RANGE = 8; // degrees

function ImageCard({
  image,
  index,
  onOpen,
}: {
  image: ImageRead;
  index: number;
  onOpen: (img: ImageRead) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const src = variantUrl(image, 'medium', 'webp');
  const ar = image.aspect_ratio
    ? parseFloat(image.aspect_ratio)
    : image.width_px / image.height_px;

  const featured = image.is_featured;
  const span = featured ? 'sm:col-span-2 sm:row-span-2' : '';

  // Tilt motion values
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]), {
    stiffness: 220,
    damping: 22,
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{
        layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : Math.min((index % 8) * 0.04, 0.35),
      }}
      className={`relative ${span}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full"
      >
        <button
          type="button"
          onClick={() => onOpen(image)}
          data-cursor="interactive"
          className="
            group relative block w-full text-left
            overflow-hidden rounded-xl bg-ink-800
            ring-1 ring-white/[0.04] hover:ring-white/[0.14]
            transition-shadow duration-500
            focus-visible:ring-2 focus-visible:ring-accent
          "
          aria-label={`View ${image.title}`}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ paddingBottom: `${(1 / ar) * 100}%` }}
          >
            {/* Dominant-colour LQIP */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: image.dominant_color ?? '#15151a' }}
            />

            <Image
              src={src}
              alt={image.alt_text}
              fill
              sizes={
                featured
                  ? '(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw'
                  : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
              }
              className="
                object-cover
                transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.08]
              "
            />

            {/* Hover scrim */}
            <div
              aria-hidden
              className="
                absolute inset-0
                bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
              "
            />

            {/* Source badge */}
            {image.source !== 'original' && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-950/70 backdrop-blur-sm text-[10px] text-zinc-200">
                <Sparkles className="h-2.5 w-2.5" />
                {image.source === 'synthetic' ? 'AI' : 'Mixed'}
              </span>
            )}

            {/* View affordance */}
            <div
              className="
                absolute top-3 right-3
                h-9 w-9 rounded-full bg-accent text-ink-950
                flex items-center justify-center
                opacity-0 -translate-y-1
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              "
              aria-hidden
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </div>

            {/* Metadata stack */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
              <div className="overflow-hidden">
                <p
                  className="
                    text-[10px] sm:text-xs uppercase tracking-[0.22em] text-accent
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                >
                  {image.category.name}
                </p>
              </div>
              <div className="overflow-hidden mt-2">
                <h3
                  className="
                    font-display font-light text-lg sm:text-xl text-white
                    tracking-tight leading-tight
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                  style={{ transitionDelay: '60ms' }}
                >
                  {image.title}
                </h3>
              </div>
              {image.caption && (
                <div className="overflow-hidden mt-1.5">
                  <p
                    className="
                      text-[11px] sm:text-xs text-zinc-300 line-clamp-2
                      translate-y-full group-hover:translate-y-0
                      transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    "
                    style={{ transitionDelay: '120ms' }}
                  >
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </button>
      </motion.div>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Minimalist lightbox
// ---------------------------------------------------------------------------
function Lightbox({
  image,
  onClose,
}: {
  image: ImageRead;
  onClose: () => void;
}) {
  const src = variantUrl(image, 'large', 'webp');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top-right close */}
      <motion.button
        type="button"
        onClick={onClose}
        data-cursor="interactive"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="
          absolute top-6 right-6 sm:top-8 sm:right-8 z-10
          inline-flex items-center gap-3
          text-[11px] uppercase tracking-[0.22em] text-zinc-300
          hover:text-white transition-colors
        "
        aria-label="Close lightbox"
      >
        <span className="hidden sm:inline">Close</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-500 hover:border-accent hover:text-accent transition-colors">
          <X className="h-4 w-4" />
        </span>
      </motion.button>

      {/* Top-left source pill */}
      {image.source !== 'original' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            absolute top-6 left-6 sm:top-8 sm:left-8 z-10
            inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-white/5 backdrop-blur-md text-[11px] text-accent
          "
        >
          <Sparkles className="h-3 w-3" />
          {image.source === 'synthetic' ? 'AI Generated' : 'Mixed Media'}
        </motion.div>
      )}

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] max-w-6xl max-h-[80dvh] aspect-[3/2]"
      >
        <Image
          src={src}
          alt={image.alt_text}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-contain"
        />
      </motion.div>

      {/* Bottom-left caption */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="
          absolute bottom-6 left-6 sm:bottom-10 sm:left-10
          max-w-md
        "
      >
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent mb-2">
          {image.category.name}
        </p>
        <h2 className="font-display font-light text-2xl sm:text-3xl text-white leading-tight tracking-tight">
          {image.title}
        </h2>
        {image.caption && (
          <p className="mt-2 text-sm text-zinc-400 max-w-sm">{image.caption}</p>
        )}
      </motion.div>

      {/* Bottom-right detail link */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="
          absolute bottom-6 right-6 sm:bottom-10 sm:right-10
          flex items-center gap-3
        "
      >
        <span className="hidden sm:block text-[10px] uppercase tracking-[0.28em] text-zinc-500 tabular-nums">
          {image.width_px} × {image.height_px}
        </span>
        <Link
          href={`/work/${image.slug}`}
          data-cursor="interactive"
          onClick={(e) => e.stopPropagation()}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-full
            border border-zinc-500 text-xs text-zinc-200
            hover:border-accent hover:text-accent transition-colors
          "
        >
          Full detail
          <ExternalLink className="h-3 w-3" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
