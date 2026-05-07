import type { Metadata } from 'next';
import { MapSection } from '../components/MapSection';
import { Footer } from '../components/Footer';
import { SectionFade } from '../components/SectionFade';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Atelier Lumina — bookings, address, hours, and how to find the Copenhagen tasting room.',
};

export default function ContactPage() {
  return (
    <main>
      <MapSection />
      <SectionFade from="#16201a" to="#111814" height="6rem" />
      <Footer />
    </main>
  );
}
