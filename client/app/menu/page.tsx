import type { Metadata } from 'next';
import { MenuPageContent } from '../components/MenuPageContent';
import { BlackFooter } from '../components/BlackFooter';
import { BlackSpacer } from '../components/BlackSpacer';
import { api, storageUrl } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    "Tonight's selection at Atelier Lumina — soups, kebabs, pitas, desserts, and drinks from the experimental tasting room in Copenhagen.",
};

export default async function MenuPage() {
  const list = await api.images
    .list({ status: 'published', page_size: 30 })
    .catch(() => ({
      items: [],
      total: 0,
      page: 1,
      page_size: 30,
      has_next: false,
    }));

  const pool = list.items.map((img) => ({
    src: storageUrl(img.storage_key),
    alt: img.alt_text,
  }));

  return (
    <main>
      <MenuPageContent pool={pool} />
      <BlackSpacer />
      <BlackFooter />
    </main>
  );
}
