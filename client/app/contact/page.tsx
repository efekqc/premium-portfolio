import type { Metadata } from 'next';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Atelier Lumina — bookings, address, and hours for the Copenhagen tasting room.',
};

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-ink-900">
      <Footer />
    </main>
  );
}
