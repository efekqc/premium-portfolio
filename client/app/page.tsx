import { Suspense } from 'react';
import { Hero, type HeroSlide } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ImageGrid } from './components/ImageGrid';
import { GalleryHeader } from './components/GalleryHeader';
import { api, storageUrl } from '@/lib/api';

interface Props {
  searchParams: { category?: string; page?: string };
}

export default async function HomePage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const categorySlug = searchParams.category;

  const [categories, imageList, featuredList] = await Promise.all([
    api.categories.list().catch(() => []),
    api.images
      .list({
        category_slug: categorySlug,
        page,
        page_size: 24,
        status: 'published',
      })
      .catch(() => ({
        items: [],
        total: 0,
        page: 1,
        page_size: 24,
        has_next: false,
      })),
    // Pull a small set of featured / recent images to drive the hero slider.
    api.images
      .list({ status: 'published', page_size: 6, is_featured: true })
      .catch(() => ({
        items: [],
        total: 0,
        page: 1,
        page_size: 6,
        has_next: false,
      })),
  ]);

  const heroSlides: HeroSlide[] = (
    featuredList.items.length > 0 ? featuredList.items : imageList.items
  )
    .slice(0, 5)
    .map((img) => ({
      src: storageUrl(img.storage_key),
      alt: img.alt_text,
      dominantColor: img.dominant_color,
    }));

  return (
    <main className="relative">
      <Hero slides={heroSlides} />

      <section
        id="gallery"
        aria-label="Photo gallery"
        className="relative mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-16 pb-24 pt-16 sm:pt-24"
      >
        <GalleryHeader
          title={
            categorySlug
              ? (categories.find((c) => c.slug === categorySlug)?.name ?? 'Gallery')
              : 'Selected Work'
          }
          eyebrow={categorySlug ? 'Filtered view' : 'A selection — 2026'}
          count={imageList.total}
          right={
            <Suspense fallback={<div className="h-9" />}>
              <CategoryNav categories={categories} activeSlug={categorySlug} />
            </Suspense>
          }
        />

        <ImageGrid images={imageList.items} />

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
