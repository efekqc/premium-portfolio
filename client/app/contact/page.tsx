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
    'Atelier Lumina — request a booking, business hours, address, and the Copenhagen tasting-room map.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Reservation form is the primary focus — sits at the top */}
      <section
        data-snap
        aria-label="Reservation"
        className="relative isolate overflow-hidden bg-ink-900 py-20 sm:py-28 px-5 sm:px-8 lg:px-12 scroll-mt-24"
      >
        <PersianTexture />
        <div className="relative mx-auto max-w-4xl">
          <ReservationForm />
        </div>
      </section>

      {/* Address / hours / contact links */}
      <ContactInfoBlock />

      {/* Embedded map */}
      <MapSection />

      <BlackSpacer />
      <BlackFooter />
    </main>
  );
}
