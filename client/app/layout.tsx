import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { CustomCursor } from './components/CustomCursor';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
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
  themeColor: '#0a0a0b',
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
      <body className="min-h-dvh overflow-x-hidden cursor-fine-none">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
