import { Hero, type HeroSlide } from './components/Hero';
import { GalleryHeader } from './components/GalleryHeader';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { api, storageUrl } from '@/lib/api';

interface Props {
  searchParams: { category?: string };
}

/**
 * Home page is one continuous editorial — Hero, Gallery (with client-side
 * filtering), and Footer. We fetch ALL published images server-side and let
 * the Gallery client component slice them by category in-memory so filtering
 * triggers smooth `layout` animations rather than a network round-trip.
 */
export default async function HomePage({ searchParams }: Props) {
  const initialCategorySlug = searchParams.category;

  const [categories, imageList, featuredList] = await Promise.all([
    api.categories.list().catch(() => []),
    api.images
      .list({ status: 'published', page_size: 100 })
      .catch(() => ({
        items: [],
        total: 0,
        page: 1,
        page_size: 100,
        has_next: false,
      })),
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
    <>
      <main className="relative z-10 bg-ink-950">
        <Hero slides={heroSlides} />

        <section
          id="gallery"
          aria-label="Photo gallery"
          className="relative mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-16 pb-32 pt-16 sm:pt-24 scroll-mt-4"
        >
          <GalleryHeader
            title="Selected Work"
            eyebrow="The studio archive · 2024 — 2026"
            count={imageList.total}
          />

          <Gallery
            categories={categories}
            images={imageList.items}
            initialCategorySlug={initialCategorySlug}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
