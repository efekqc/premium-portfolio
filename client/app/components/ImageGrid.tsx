'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { variantUrl, type ImageRead } from '@/lib/api';

interface Props {
  images: ImageRead[];
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------------------------
// ImageGrid
// ---------------------------------------------------------------------------
export function ImageGrid({ images }: Props) {
  const [selected, setSelected] = useState<ImageRead | null>(null);

  // Esc + scroll-lock
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
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
      <motion.ul
        role="list"
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onOpen={setSelected} />
        ))}
      </motion.ul>

      <AnimatePresence>
        {selected && (
          <Lightbox image={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
function ImageCard({
  image,
  onOpen,
}: {
  image: ImageRead;
  onOpen: (img: ImageRead) => void;
}) {
  const src = variantUrl(image, 'medium', 'webp');
  const ar = image.aspect_ratio
    ? parseFloat(image.aspect_ratio)
    : image.width_px / image.height_px;

  return (
    <motion.li variants={cardVariants}>
      <button
        type="button"
        onClick={() => onOpen(image)}
        className="group block w-full text-left overflow-hidden rounded-xl bg-ink-800 focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View ${image.title}`}
      >
        {/* Image area */}
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: `${(1 / ar) * 100}%` }}
        >
          {/* Dominant colour / LQIP placeholder */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-700"
            style={{ backgroundColor: image.dominant_color ?? '#15151a' }}
          />

          <Image
            src={src}
            alt={image.alt_text}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute inset-0 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />

          {/* Hover scrim — dark gradient rising from the bottom */}
          <div
            aria-hidden
            className="
              absolute inset-0
              bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          />

          {/* Source badge */}
          {image.source !== 'original' && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink-950/70 backdrop-blur-sm text-[10px] text-zinc-400">
              <Sparkles className="h-2.5 w-2.5" />
              {image.source === 'synthetic' ? 'AI' : 'Mixed'}
            </span>
          )}

          {/* Title slides up on hover */}
          <div
            className="
              absolute bottom-0 inset-x-0 px-3 py-3
              translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-300 ease-out
            "
          >
            <p className="text-xs font-medium text-white truncate drop-shadow">
              {image.title}
            </p>
          </div>
        </div>

        {/* Caption row (always visible) */}
        <div className="px-2.5 py-2">
          <p className="text-xs font-medium text-zinc-200 truncate">{image.title}</p>
          {image.caption && (
            <p className="mt-0.5 text-[11px] text-zinc-500 truncate">{image.caption}</p>
          )}
        </div>
      </button>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function Lightbox({ image, onClose }: { image: ImageRead; onClose: () => void }) {
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
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700 shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{image.title}</p>
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

        {/* Image */}
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

        {/* Footer — tags + dimensions */}
        <div className="px-4 py-3 border-t border-ink-700 shrink-0 flex flex-wrap items-center gap-2">
          {image.tags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full border border-ink-600 text-zinc-500"
              style={tag.color_hex ? { borderColor: `${tag.color_hex}44`, color: `${tag.color_hex}cc` } : undefined}
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
