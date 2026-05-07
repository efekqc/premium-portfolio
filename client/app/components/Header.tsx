'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'Menu', href: '/#menu' },
  { label: 'Reservations', href: '/#location' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
];

export function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-md bg-ink-950/45
        border-b border-white/[0.06]
      "
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center">
        {/* Logo — left */}
        <Link
          href="/"
          data-cursor="interactive"
          className="font-display italic text-xl sm:text-2xl text-white tracking-tight"
        >
          Lumina<span className="not-italic text-accent">.</span>
        </Link>

        {/* Center nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 lg:gap-9"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="interactive"
                className="
                  group relative text-[11px] uppercase tracking-[0.22em]
                  text-zinc-300 hover:text-white transition-colors
                "
              >
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 28,
                    }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 block h-px w-6 bg-accent"
                  />
                )}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 block h-px w-0 bg-zinc-500 transition-all duration-300 group-hover:w-4" />
              </Link>
            );
          })}
        </nav>

        {/* Right — social */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              data-cursor="interactive"
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-full text-zinc-400
                hover:text-accent hover:bg-white/5
                transition-colors
              "
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
