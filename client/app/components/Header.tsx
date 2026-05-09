'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Instagram, Facebook, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { MobileSidebar } from './MobileSidebar';

interface NavItem {
  label: string;
  href: string;
}

const NAV: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Menü', href: '/menu' },
  { label: 'Hakkımızda', href: '/about' },
  { label: 'İletişim', href: '/contact' },
];

const SOCIAL = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: TripAdvisorIcon, href: 'https://tripadvisor.com', label: 'TripAdvisor' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: NavItem) {
    if (item.href === '/') return pathname === '/';
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          backdrop-blur-md bg-ink-900/60
          border-b border-[#c5a059]/25
        "
        style={{ height: 'var(--header-h, 72px)' }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 h-full flex items-center">
          {/* ── Mobile hamburger ─────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="
              md:hidden -ml-2 inline-flex h-10 w-10 items-center justify-center
              rounded-full text-[#c5a059] hover:bg-[#c5a059]/10
              transition-colors
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* ── Logo (hex-star + name) ───────────────────────────────────── */}
          <Link
            href="/"
            aria-label="Atelier Lumina"
            className="ml-2 md:ml-0 group flex items-center gap-3 leading-none"
          >
            <span className="text-[#c5a059] transition-transform duration-500 group-hover:rotate-[18deg]">
              <HexStarIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <span className="font-display italic text-2xl sm:text-3xl text-[#c5a059] tracking-tight leading-none">
              Lumina
            </span>
          </Link>

          {/* ── Center nav (desktop only) ────────────────────────────────── */}
          <nav
            aria-label="Primary"
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 lg:gap-10"
          >
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative font-sans font-medium
                    text-[11px] sm:text-xs uppercase tracking-[0.28em]
                    text-[#c5a059]/75 hover:text-[#c5a059]
                    transition-colors py-1.5
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
                        mass: 0.6,
                      }}
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#c5a059]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right side: socials + REZERVASYON ────────────────────────── */}
          <div className="ml-auto flex items-center gap-2">
            {/* Social pills (desktop only — mobile uses sidebar) */}
            <div className="hidden lg:flex items-center gap-2">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="
                    inline-flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-[#c5a059]/60
                    text-[#c5a059]
                    hover:bg-[#c5a059] hover:text-ink-950
                    hover:border-[#c5a059]
                    transition-colors
                  "
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Rezervasyon CTA — strict rectangle, gold outline */}
            <Link
              href="/contact"
              className="
                ml-1 sm:ml-2
                inline-flex items-center justify-center
                px-3 py-2 sm:px-5 sm:py-2.5
                border border-[#c5a059]
                bg-transparent
                text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium
                text-[#c5a059]
                hover:bg-[#c5a059] hover:text-ink-950
                transition-colors
              "
            >
              Rezervasyon
            </Link>
          </div>
        </div>
      </header>

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        nav={NAV}
        isActive={isActive}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Geometric brand mark — hexagon outline with a star inside, single colour
// (currentColor so it inherits text-[#c5a059] from its parent).
// ---------------------------------------------------------------------------
function HexStarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      {/* Hexagon outline */}
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" strokeWidth="1.5" />
      {/* Star inside (slim) */}
      <path
        d="M16 9 L17.4 13.5 L22 13.5 L18.3 16.2 L19.7 21 L16 18.2 L12.3 21 L13.7 16.2 L10 13.5 L14.6 13.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TripAdvisor-style mark (owl-eye binoculars) — TripAdvisor isn't in
// lucide-react, so this is a stylised stand-in that reads as "the eye logo".
// ---------------------------------------------------------------------------
function TripAdvisorIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <ellipse cx="12" cy="12" rx="10" ry="7" />
      <circle cx="8.5" cy="12" r="2.4" />
      <circle cx="15.5" cy="12" r="2.4" />
      <circle cx="8.5" cy="12" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
