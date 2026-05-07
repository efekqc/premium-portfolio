'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  /** Section id this link points to on the home page (drives scroll-spy). */
  sectionId?: string;
}

const NAV: NavItem[] = [
  { label: 'Home', href: '/', sectionId: 'hero' },
  { label: 'About Us', href: '/#about', sectionId: 'about' },
  { label: 'Menu', href: '/#menu', sectionId: 'menu' },
  { label: 'Reservations', href: '/#location', sectionId: 'location' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
];

const SCROLL_SPY_IDS = ['hero', 'about', 'menu', 'location'] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === '/';
  const [activeSection, setActiveSection] = useState<string>('hero');

  // ── Scroll-spy: which home-page section is currently in view? ─────────
  useEffect(() => {
    if (!onHome) return;

    const targets = SCROLL_SPY_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // A section becomes "active" when its top is within the slim band
    // just below the sticky header (top ~72px) and roughly the upper
    // third of the viewport.  This avoids active-state flicker while
    // multiple sections are simultaneously in view.
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry that is most prominently inside the activation
        // band (closest to the top of the band).
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-72px 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome]);

  function isActive(item: NavItem) {
    if (!onHome) {
      // Off-home: simple route check
      if (item.href === '/') return false;
      return pathname.startsWith(item.href);
    }
    if (item.href === '/contact') return false;
    if (!item.sectionId) return false;
    return item.sectionId === activeSection;
  }

  /**
   * Smooth-scroll for hash links when already on the home page.  Uses
   * `scrollIntoView({ behavior: 'smooth' })` which respects each
   * section's `scroll-margin-top` (set globally for the sticky header),
   * so the destination lands right under the header — no jumpy snap.
   */
  function handleNavClick(e: MouseEvent<HTMLAnchorElement>, item: NavItem) {
    if (!item.sectionId) return; // /contact and other real routes
    const id = item.sectionId;

    if (onHome) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Push the hash for shareability without scroll-jump
        const target = item.href.startsWith('/#')
          ? `/${item.href.slice(1)}`
          : item.href;
        window.history.replaceState(null, '', target);
        setActiveSection(id);
      }
      return;
    }

    // From another page: navigate to home, hash fragment will be honoured
    // by the browser and our scroll-margin-top will cushion the landing.
    if (item.href.startsWith('/#')) {
      e.preventDefault();
      router.push(item.href);
    }
  }

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-md bg-ink-800/55
        border-b border-white/[0.05]
      "
      style={{ height: 'var(--header-h, 72px)' }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 h-full flex items-center">
        {/* Logo — left */}
        <Link
          href="/"
          data-cursor="interactive"
          className="font-display italic text-2xl sm:text-3xl text-white tracking-tight leading-none"
        >
          Lumina<span className="not-italic text-accent">.</span>
        </Link>

        {/* Center nav */}
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
                data-cursor="interactive"
                onClick={(e) => handleNavClick(e, item)}
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
