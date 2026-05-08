import type { Metadata } from 'next';
import { ContactInfoBlock } from '../components/ContactInfoBlock';
import { ReservationForm } from '../components/ReservationForm';
import { MapSection } from '../components/MapSection';
import { BlackFooter } from '../components/BlackFooter';
import { BlackSpacer } from '../components/BlackSpacer';
import { PersianTexture } from '../components/PersianTexture';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Atelier Lumina — bookings, business hours, address, and reservation form for the Copenhagen tasting room.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Address / hours / contact links */}
      <ContactInfoBlock />

      {/* Reservation booking form */}
      <section
        data-snap
        aria-label="Reservation"
        className="relative isolate overflow-hidden bg-ink-900 py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
      >
        <PersianTexture opacity={0.03} />
        <div className="relative mx-auto max-w-4xl">
          <ReservationForm />
        </div>
      </section>

      {/* Embedded map */}
      <MapSection />

      <BlackSpacer />
      <BlackFooter />
    </main>
  );
}
