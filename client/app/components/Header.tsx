'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Instagram, Twitter, Facebook, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { MobileSidebar } from './MobileSidebar';

interface NavItem {
  label: string;
  href: string;
}

const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
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
          backdrop-blur-md bg-ink-800/55
          border-b border-accent/15
        "
        style={{ height: 'var(--header-h, 72px)' }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 h-full flex items-center">
          {/* Mobile hamburger — visible on <md only */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="md:hidden -ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-200 hover:text-accent hover:bg-white/5 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo — left on desktop, after hamburger on mobile */}
          <Link
            href="/"
            className="ml-2 md:ml-0 font-display italic text-2xl sm:text-3xl text-white tracking-tight leading-none hover:text-accent transition-colors"
          >
            Lumina<span className="not-italic text-accent">.</span>
          </Link>

          {/* Center nav — desktop only */}
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
                    group relative text-[11px] uppercase tracking-[0.22em]
                    text-zinc-300 hover:text-white transition-colors py-1
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
                      className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    />
                  )}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 block h-px w-0 bg-zinc-500/70 transition-all duration-300 group-hover:w-4" />
                </Link>
              );
            })}
          </nav>

          {/* Right — social.  On mobile show only Instagram for compactness. */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }, i) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className={`
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-full text-zinc-400
                  hover:text-accent hover:bg-white/5
                  transition-colors
                  ${i === 0 ? '' : 'hidden sm:inline-flex'}
                `}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
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
