import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { CategoryNav } from '../components/CategoryNav';
import { ImageGrid } from '../components/ImageGrid';

export const metadata: Metadata = {
  title: 'Work',
  description: 'The full archive — original and AI-generated food and restaurant photography.',
};

interface Props {
  searchParams: { category?: string; tag?: string; page?: string };
}

export default async function WorkPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const { category: categorySlug, tag: tagSlug } = searchParams;

  const [categories, imageList] = await Promise.all([
    api.categories.list().catch(() => []),
    api.images
      .list({
        status: 'published',
        category_slug: categorySlug,
        tag_slug: tagSlug,
        page,
        page_size: 32,
      })
      .catch(() => ({ items: [], total: 0, page: 1, page_size: 32, has_next: false })),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <main className="min-h-dvh bg-ink-950">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-ink-600 select-none">|</span>
          <span className="text-sm font-medium text-zinc-300">
            {activeCategory?.name ?? tagSlug ? `#${tagSlug}` : 'All Work'}
          </span>
          <span className="ml-auto text-xs text-zinc-600 tabular-nums">
            {imageList.total} {imageList.total === 1 ? 'image' : 'images'}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 py-8">
        {/* ── Page title ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-light text-zinc-50 tracking-tight">
            {activeCategory?.name ?? (tagSlug ? `#${tagSlug}` : 'The Archive')}
          </h1>
          {activeCategory?.description && (
            <p className="mt-2 text-sm text-zinc-500 max-w-xl">{activeCategory.description}</p>
          )}
        </div>

        {/* ── Category filter ────────────────────────────────────────── */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-9" />}>
            <CategoryNav categories={categories} activeSlug={categorySlug} />
          </Suspense>
        </div>

        <div className="hairline mb-8" />

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <ImageGrid images={imageList.items} />

        {/* ── Pagination ─────────────────────────────────────────────── */}
        {(page > 1 || imageList.has_next) && (
          <div className="mt-12 flex justify-center gap-3">
            {page > 1 && (
              <a
                href={buildHref({ categorySlug, tagSlug, page: page - 1 })}
                className="px-5 py-2 rounded-full border border-ink-600 text-sm text-zinc-300 hover:border-ink-500 hover:text-white transition-colors"
              >
                ← Previous
              </a>
            )}
            {imageList.has_next && (
              <a
                href={buildHref({ categorySlug, tagSlug, page: page + 1 })}
                className="px-5 py-2 rounded-full border border-ink-600 text-sm text-zinc-300 hover:border-ink-500 hover:text-white transition-colors"
              >
                Next →
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function buildHref({
  categorySlug,
  tagSlug,
  page,
}: {
  categorySlug?: string;
  tagSlug?: string;
  page: number;
}) {
  const p = new URLSearchParams();
  if (categorySlug) p.set('category', categorySlug);
  if (tagSlug) p.set('tag', tagSlug);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return qs ? `/work?${qs}` : '/work';
}
