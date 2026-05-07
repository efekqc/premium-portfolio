import { Hero, type HeroSlide } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CarouselSection, type CarouselItem } from './components/CarouselSection';
import { BlackFooter } from './components/BlackFooter';
import { SectionFade } from './components/SectionFade';
import { api, storageUrl } from '@/lib/api';

const FOREST = '#16201a';
const SAND = '#ece8e1';

/**
 * Homepage = minimalist showcase.
 *
 * Hero · brief About · Image Carousel · BlackFooter.
 * Menu, Testimonials, and Map have moved to dedicated routes
 * (/menu, /about, /contact respectively).
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

  const heroSlides: HeroSlide[] = (
    featuredList.items.length > 0 ? featuredList.items : imageList.items
  )
    .slice(0, 5)
    .map((img) => ({
      src: storageUrl(img.storage_key),
      alt: img.alt_text,
      dominantColor: img.dominant_color,
    }));

  const aboutSlides = imageList.items.slice(2, 6).map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

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

      <SectionFade from={FOREST} to={SAND} />
      <CarouselSection items={carouselItems} />

      <SectionFade from={SAND} to={FOREST} />

      {/* Closing strip + minimal footer */}
      <SectionFade from={FOREST} to="#0d130f" height="6rem" />
      <BlackFooter />
    </>
  );
}
