import { Suspense } from 'react';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ImageGrid } from './components/ImageGrid';
import { api } from '@/lib/api';

interface Props {
  searchParams: { category?: string; page?: string };
}

/**
 * Server Component — data is fetched on the server, streamed to the client.
 *
 * Zero Page Reload:
 *  - Initial HTML arrives fully populated (no client-side data waterfall).
 *  - Filtering via CategoryNav updates the URL param; Next.js diffs the RSC
 *    tree and re-renders only the changed subtree — no full navigation.
 *  - Pagination (page param) follows the same pattern.
 */
export default async function HomePage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const categorySlug = searchParams.category;

  // Parallel fetch — categories for the nav, images for the grid.
  const [categories, imageList] = await Promise.all([
    api.categories.list().catch(() => []),
    api.images
      .list({ category_slug: categorySlug, page, page_size: 24, status: 'published' })
      .catch(() => ({ items: [], total: 0, page: 1, page_size: 24, has_next: false })),
  ]);

  return (
    <main className="relative">
      <Hero />

      {/* ── Gallery section ──────────────────────────────────────────────── */}
      <section
        id="gallery"
        aria-label="Photo gallery"
        className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-16 pb-24"
      >
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-zinc-100 tracking-tight">
              {categorySlug
                ? (categories.find((c) => c.slug === categorySlug)?.name ?? 'Gallery')
                : 'Gallery'}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {imageList.total} {imageList.total === 1 ? 'image' : 'images'}
            </p>
          </div>

          {/* CategoryNav is a Client Component; wrap in Suspense because it
              calls useSearchParams() which requires a boundary in App Router. */}
          <Suspense fallback={<div className="h-9" />}>
            <CategoryNav categories={categories} activeSlug={categorySlug} />
          </Suspense>
        </div>

        {/* Divider */}
        <div className="hairline mb-8" />

        <ImageGrid images={imageList.items} />

        {/* Pagination — simple prev / next links (RSC-native, zero JS) */}
        {(page > 1 || imageList.has_next) && (
          <div className="mt-12 flex justify-center gap-3">
            {page > 1 && (
              <a
                href={buildPageHref(categorySlug, page - 1)}
                className="px-5 py-2 rounded-full border border-ink-600 text-sm text-zinc-300 hover:border-ink-500 hover:text-white transition-colors"
              >
                ← Previous
              </a>
            )}
            {imageList.has_next && (
              <a
                href={buildPageHref(categorySlug, page + 1)}
                className="px-5 py-2 rounded-full border border-ink-600 text-sm text-zinc-300 hover:border-ink-500 hover:text-white transition-colors"
              >
                Next →
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function buildPageHref(categorySlug: string | undefined, page: number): string {
  const params = new URLSearchParams();
  if (categorySlug) params.set('category', categorySlug);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}
