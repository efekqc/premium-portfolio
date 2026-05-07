import type { Metadata } from 'next';
import { MenuSection } from '../components/MenuSection';
import { BlackFooter } from '../components/BlackFooter';
import { SectionFade } from '../components/SectionFade';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    "Tonight's selection at Atelier Lumina — soups, kebabs, pitas, desserts, and drinks from the experimental tasting room in Copenhagen.",
};

export default function MenuPage() {
  return (
    <main>
      <MenuSection />
      <SectionFade from="#16201a" to="#0d130f" height="6rem" />
      <BlackFooter />
    </main>
  );
}
