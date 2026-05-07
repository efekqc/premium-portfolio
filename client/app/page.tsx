import { Hero, type HeroSlide } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CarouselSection, type CarouselItem } from './components/CarouselSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MapSection } from './components/MapSection';
import { BlackFooter } from './components/BlackFooter';
import { SectionFade } from './components/SectionFade';
import { api, storageUrl } from '@/lib/api';

const FOREST = '#1b241e'; // ink-800
const SAND = '#f4f1ea';   // sand-100
const OLIVE = '#0e1612';  // ink-950 (testimonials)

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

      {/* About sits in the same forest range as Hero — no fade needed. */}
      <AboutSection slides={aboutSlides.length > 0 ? aboutSlides : heroSlides} />

      {/* forest → sand */}
      <SectionFade from={FOREST} to={SAND} />
      <CarouselSection items={carouselItems} />

      {/* sand → forest */}
      <SectionFade from={SAND} to={FOREST} />
      <MenuSection />

      {/* forest → deep olive (testimonials) */}
      <SectionFade from={FOREST} to={OLIVE} />
      <TestimonialsSection />

      {/* olive → forest */}
      <SectionFade from={OLIVE} to={FOREST} />
      <MapSection />

      {/* forest → black footer */}
      <SectionFade from={FOREST} to="#000000" height="6rem" />
      <BlackFooter />
    </>
  );
}
