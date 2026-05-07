import { Hero, type HeroSlide } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CarouselSection, type CarouselItem } from './components/CarouselSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MapSection } from './components/MapSection';
import { BlackFooter } from './components/BlackFooter';
import { api, storageUrl } from '@/lib/api';

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

  // Hero rotates through featured images (or first published if none featured).
  const heroSlides: HeroSlide[] = (
    featuredList.items.length > 0 ? featuredList.items : imageList.items
  )
    .slice(0, 5)
    .map((img) => ({
      src: storageUrl(img.storage_key),
      alt: img.alt_text,
      dominantColor: img.dominant_color,
    }));

  // About section uses a different curated subset for visual distinction.
  const aboutSlides = imageList.items.slice(2, 6).map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

  // Carousel — venue/plate imagery (use the broader image set).
  const carouselItems: CarouselItem[] = imageList.items
    .slice(0, 12)
    .map((img) => ({
      src: storageUrl(img.storage_key),
      alt: img.alt_text,
      caption: img.title,
    }));

  return (
    <>
      <Hero slides={heroSlides} />
      <AboutSection slides={aboutSlides.length > 0 ? aboutSlides : heroSlides} />
      <CarouselSection items={carouselItems} />
      <MenuSection />
      <TestimonialsSection />
      <MapSection />
      <BlackFooter />
    </>
  );
}
