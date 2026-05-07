import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, Eye, Tag } from 'lucide-react';
import { api, variantUrl, type ImageRead } from '@/lib/api';

interface Props {
  params: { slug: string };
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const image = await api.images.get(params.slug).catch(() => null);
  if (!image) return { title: 'Not Found' };
  return {
    title: image.title,
    description: image.caption ?? image.alt_text,
    openGraph: {
      title: image.title,
      description: image.caption ?? image.alt_text,
      images: [{ url: variantUrl(image, 'large', 'webp') }],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function WorkDetailPage({ params }: Props) {
  const image = await api.images.get(params.slug).catch(() => null);
  if (!image) notFound();

  const heroUrl = variantUrl(image, 'large', 'webp');

  return (
    <main className="min-h-dvh bg-ink-950">
      {/* Back nav */}
      <div className="sticky top-0 z-10 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-ink-600 select-none">|</span>
          <span className="text-sm text-zinc-300 truncate">{image.title}</span>
        </div>
      </div>

      {/* Body — stacks on mobile, side-by-side on lg+ */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 xl:gap-16">
          {/* ── Left: image ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-[57px] lg:self-start">
            <div
              className="relative w-full overflow-hidden rounded-xl bg-ink-800"
              style={{
                paddingBottom: image.aspect_ratio
                  ? `${(1 / parseFloat(image.aspect_ratio)) * 100}%`
                  : `${(image.height_px / image.width_px) * 100}%`,
              }}
            >
              {image.dominant_color && (
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundColor: image.dominant_color }}
                />
              )}
              <Image
                src={heroUrl}
                alt={image.alt_text}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, calc(100vw - 440px)"
                className="absolute inset-0 object-contain"
              />
            </div>

            {/* EXIF strip below image */}
            {Object.keys(image.exif_data).length > 0 && (
              <ExifStrip data={image.exif_data} />
            )}
          </div>

          {/* ── Right: metadata ─────────────────────────────────────────── */}
          <aside className="mt-8 lg:mt-0 space-y-8">
            {/* Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <CategoryPill name={image.category.name} slug={image.category.slug} />
                <SourceBadge source={image.source} />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-light text-zinc-50 tracking-tight leading-tight">
                {image.title}
              </h1>
              {image.caption && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{image.caption}</p>
              )}
              {image.description && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{image.description}</p>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-5 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {image.view_count.toLocaleString()} views
              </span>
              <span>
                {image.width_px} × {image.height_px}
              </span>
              <span>{formatBytes(image.file_size_bytes)}</span>
            </div>

            {/* Tags */}
            {image.tags.length > 0 && (
              <div>
                <SectionLabel icon={<Tag className="h-3 w-3" />} label="Tags" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {image.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/?tag=${tag.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs border border-ink-600 text-zinc-400 hover:border-ink-500 hover:text-zinc-200 transition-colors"
                      style={tag.color_hex ? { borderColor: `${tag.color_hex}55` } : undefined}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* AI metadata */}
            {image.source !== 'original' && Object.keys(image.ai_metadata).length > 0 && (
              <MetaSection
                icon={<Sparkles className="h-3 w-3" />}
                label="AI Metadata"
                data={image.ai_metadata}
              />
            )}

            {/* Variants */}
            {image.variants.length > 0 && (
              <div>
                <SectionLabel label="Available sizes" />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {image.variants.map((v) => (
                    <a
                      key={`${v.size}-${v.format}`}
                      href={variantUrl(image, v.size, v.format)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center px-3 py-2 rounded-lg bg-ink-800 hover:bg-ink-700 transition-colors text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      <span className="capitalize">{v.size}</span>
                      <span className="uppercase text-zinc-600">{v.format}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            {image.captured_at && (
              <p className="text-xs text-zinc-600">
                Captured {new Date(image.captured_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryPill({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/?category=${slug}`}
      className="text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-ink-700 text-zinc-400 hover:text-zinc-200 transition-colors"
    >
      {name}
    </Link>
  );
}

function SourceBadge({ source }: { source: ImageRead['source'] }) {
  if (source === 'original') return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-ink-700 text-accent">
      <Sparkles className="h-3 w-3" />
      {source === 'synthetic' ? 'AI Generated' : 'Mixed Media'}
    </span>
  );
}

function SectionLabel({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
      {icon}
      {label}
    </div>
  );
}

function MetaSection({
  label,
  data,
  icon,
}: {
  label: string;
  data: Record<string, unknown>;
  icon?: React.ReactNode;
}) {
  const entries = Object.entries(data).filter(([, v]) => v !== null && v !== '');
  if (entries.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={icon} label={label} />
      <dl className="mt-3 space-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[140px_1fr] gap-2 text-xs">
            <dt className="text-zinc-600 truncate capitalize">{k.replace(/_/g, ' ')}</dt>
            <dd className="text-zinc-300 break-words">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ExifStrip({ data }: { data: Record<string, unknown> }) {
  // Only surface the most human-readable EXIF fields in the strip.
  const PRIORITY_KEYS = ['Make', 'Model', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO'];
  const entries = PRIORITY_KEYS
    .filter((k) => data[k] !== undefined)
    .map((k) => [k, String(data[k])] as [string, string]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-zinc-500">
      {entries.map(([k, v]) => (
        <span key={k}>
          <span className="text-zinc-600">{k} </span>
          {v}
        </span>
      ))}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
