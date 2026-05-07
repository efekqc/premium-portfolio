import type { Metadata } from 'next';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlackFooter } from '../components/BlackFooter';
import { SectionFade } from '../components/SectionFade';
import { api, storageUrl } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Atelier Lumina — the experimental gastronomy studio in Copenhagen, the team, and what guests say.',
};

const FOREST = '#16201a';
const OLIVE = '#0d130f';

export default async function AboutPage() {
  // Pull a curated subset for the AboutSection's crossfading background.
  const list = await api.images
    .list({ status: 'published', page_size: 8 })
    .catch(() => ({
      items: [],
      total: 0,
      page: 1,
      page_size: 8,
      has_next: false,
    }));

  const slides = list.items.slice(0, 4).map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

  return (
    <main>
      <AboutSection slides={slides} />

      <SectionFade from={FOREST} to={OLIVE} />
      <TestimonialsSection />

      <SectionFade from={OLIVE} to="#0d130f" height="6rem" />
      <BlackFooter />
    </main>
  );
}
