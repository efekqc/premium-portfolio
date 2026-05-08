import { MenuPromoSection } from './components/MenuPromoSection';
import { ReservationPromoSection } from './components/ReservationPromoSection';
import { BlackSpacer } from './components/BlackSpacer';
import { CarouselAboutPromo } from './components/CarouselAboutPromo';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MapSection } from './components/MapSection';
import { BlackFooter } from './components/BlackFooter';
import type { CarouselItem } from './components/CarouselSection';
import { api, storageUrl } from '@/lib/api';

/**
 * Homepage — strict 6-section flow:
 *
 *   1. Intro / Menu Promo  (50/50 split, image left, text right → /menu)
 *   2. Reservation Promo   (full-width darkened photo bg → /contact)
 *   3. Pure-black spacer
 *   4. Carousel + About Promo  (carousel on top, unified text + button → /about)
 *   5. Testimonials with rounded muted cards
 *   6. Map iframe + black footer
 */
export default async function HomePage() {
  const [imageList, featuredList] = await Promise.all([
    api.images
      .list({ status: 'published', page_size: 30 })
      .catch(() => ({
        items: [],
        total: 0,
        page: 1,
        page_size: 30,
        has_next: false,
      })),
    api.images
      .list({ status: 'published', page_size: 8, is_featured: true })
      .catch(() => ({
        items: [],
        total: 0,
        page: 1,
        page_size: 8,
        has_next: false,
      })),
  ]);

  const featured = featuredList.items[0] ?? imageList.items[0];
  const reservationBg = featuredList.items[1] ?? imageList.items[1] ?? featured;

  const carouselItems: CarouselItem[] = imageList.items
    .slice(0, 12)
    .map((img) => ({
      src: storageUrl(img.storage_key),
      alt: img.alt_text,
      caption: img.title,
    }));

  return (
    <>
      {/* SECTION 1 — Intro / Menu Promo */}
      <MenuPromoSection
        image={
          featured
            ? storageUrl(featured.storage_key)
            : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=85'
        }
        alt={featured?.alt_text ?? 'Featured plate'}
      />

      {/* SECTION 2 — Reservation Promo */}
      <ReservationPromoSection
        bgImage={
          reservationBg
            ? storageUrl(reservationBg.storage_key)
            : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80'
        }
        bgAlt={reservationBg?.alt_text ?? 'Atelier Lumina interior'}
      />

      {/* SECTION 3 — Pure-black spacer */}
      <BlackSpacer />

      {/* SECTION 4 — Carousel + About Promo */}
      <CarouselAboutPromo items={carouselItems} />

      {/* SECTION 5 — Testimonials */}
      <TestimonialsSection />

      {/* SECTION 6 — Map + black footer */}
      <MapSection />
      <BlackFooter />
    </>
  );
}
