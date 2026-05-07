import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Header } from './components/Header';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

/**
 * Cormorant Garamond replaces Fraunces — softer humanist forms, gentle
 * old-style italic, warmer overall feel for the new organic theme.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'Atelier Lumina — Avant-Garde Gastronomy, Copenhagen',
    template: '%s · Atelier Lumina',
  },
  description:
    'A 14-seat experimental gastronomy studio in Copenhagen. Edible architecture at the intersection of fire, fermentation, and latent space.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Atelier Lumina',
    title: 'Atelier Lumina — Avant-Garde Gastronomy, Copenhagen',
    description:
      'A 14-seat experimental gastronomy studio in Copenhagen. Edible architecture at the intersection of fire, fermentation, and latent space.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#16201a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} dark`}>
      <body className="min-h-dvh overflow-x-hidden">
        <Header />
        {children}
      </body>
    </html>
  );
}
