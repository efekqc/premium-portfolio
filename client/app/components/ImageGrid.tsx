'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { variantUrl, type ImageRead } from '@/lib/api';

interface Props {
  images: ImageRead[];
}

export function ImageGrid({ images }: Props) {
  const [selected, setSelected] = useState<ImageRead | null>(null);

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

  if (images.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-zinc-500">
        No images yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <ul
        role="list"
        className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {images.map((image, i) => (
          <ImageCard
            key={image.id}
            image={image}
            index={i}
            onOpen={setSelected}
          />
        ))}
      </ul>

      <AnimatePresence>
        {selected && (
          <Lightbox image={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

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
  const src = variantUrl(image, 'medium', 'webp');
  const ar = image.aspect_ratio
    ? parseFloat(image.aspect_ratio)
    : image.width_px / image.height_px;

  // Featured items get more visual weight (editorial bento feel)
  const featured = image.is_featured;
  const span = featured ? 'sm:col-span-2 sm:row-span-2' : '';

  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : Math.min((index % 8) * 0.05, 0.4),
      }}
      className={span}
    >
      <button
        type="button"
        onClick={() => onOpen(image)}
        className="
          group relative block w-full text-left
          overflow-hidden rounded-xl bg-ink-800
          ring-1 ring-white/[0.04] hover:ring-white/[0.12]
          transition-[box-shadow,ring] duration-500
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

          {/* Image with hover zoom */}
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

          {/* Source badge — always visible */}
          {image.source !== 'original' && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-950/70 backdrop-blur-sm text-[10px] text-zinc-200">
              <Sparkles className="h-2.5 w-2.5" />
              {image.source === 'synthetic' ? 'AI' : 'Mixed'}
            </span>
          )}

          {/* View affordance — top-right, slides in on hover */}
          <div
            className="
              absolute top-3 right-3
              h-9 w-9 rounded-full bg-accent text-ink-950
              flex items-center justify-center
              opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            "
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </div>

          {/* Metadata stack — slides up in staggered layers on hover */}
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
    </motion.li>
  );
}

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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-ink-950/92 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col max-h-[90dvh] max-w-5xl w-full bg-ink-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700 shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {image.title}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 truncate">
              {image.category.name}
              {image.source !== 'original' && (
                <span className="ml-2 inline-flex items-center gap-1 text-accent">
                  <Sparkles className="h-2.5 w-2.5" />
                  {image.source === 'synthetic' ? 'AI Generated' : 'Mixed Media'}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Link
              href={`/work/${image.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 border border-ink-600 hover:border-ink-500 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Full detail
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-ink-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 bg-ink-950">
          <Image
            src={src}
            alt={image.alt_text}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-contain"
          />
        </div>

        <div className="px-4 py-3 border-t border-ink-700 shrink-0 flex flex-wrap items-center gap-2">
          {image.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full border border-ink-600 text-zinc-500"
              style={
                tag.color_hex
                  ? {
                      borderColor: `${tag.color_hex}44`,
                      color: `${tag.color_hex}cc`,
                    }
                  : undefined
              }
            >
              {tag.name}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-zinc-600 tabular-nums">
            {image.width_px} × {image.height_px}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
