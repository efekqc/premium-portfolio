import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

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
    default: 'Portfolio — Light, Captured.',
    template: '%s · Portfolio',
  },
  description:
    'A premium photography portfolio. Original and synthetic imagery, presented with intent.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Portfolio',
    title: 'Portfolio — Light, Captured.',
    description:
      'A premium photography portfolio. Original and synthetic imagery, presented with intent.',
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
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
