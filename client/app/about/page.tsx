import type { Metadata } from 'next';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogSection } from '../components/BlogSection';
import { BlackFooter } from '../components/BlackFooter';
import { BlackSpacer } from '../components/BlackSpacer';
import { api, storageUrl } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Atelier Lumina — the experimental gastronomy studio in Copenhagen, the team, the journal, and what guests say.',
};

export default async function AboutPage() {
  const list = await api.images
    .list({ status: 'published', page_size: 12 })
    .catch(() => ({
      items: [],
      total: 0,
      page: 1,
      page_size: 12,
      has_next: false,
    }));

  const slides = list.items.slice(0, 4).map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

  const blogPool = list.items.slice(2, 10).map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

  return (
    <main>
      <AboutSection slides={slides} />
      <BlogSection pool={blogPool} />
      <TestimonialsSection />
      <BlackSpacer />
      <BlackFooter />
    </main>
  );
}
