'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Instagram, Facebook } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

// Same TripAdvisor stand-in as the Header (kept local so no new public file)
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
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" strokeWidth="1.5" />
      <path
        d="M16 9 L17.4 13.5 L22 13.5 L18.3 16.2 L19.7 21 L16 18.2 L12.3 21 L13.7 16.2 L10 13.5 L14.6 13.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

const SOCIAL = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: TripAdvisorIcon, href: 'https://tripadvisor.com', label: 'TripAdvisor' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  isActive: (item: NavItem) => boolean;
}

export function MobileSidebar({ open, onClose, nav, isActive }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-ink-950/75 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 32,
              mass: 0.8,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="
              fixed inset-y-0 left-0 z-[90]
              flex flex-col
              w-[82%] max-w-[340px]
              bg-ink-900
              border-r border-[#c5a059]/30
              md:hidden
            "
          >
            {/* Header strip */}
            <div className="flex items-center justify-between px-6 h-[var(--header-h,72px)] border-b border-[#c5a059]/20">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2 leading-none"
              >
                <HexStarIcon className="h-6 w-6 text-[#c5a059]" />
                <span className="font-display italic text-2xl text-[#c5a059] tracking-tight leading-none">
                  Lumina
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="
                  inline-flex h-9 w-9 items-center justify-center rounded-full
                  border border-[#c5a059]/40 text-[#c5a059]
                  hover:border-[#c5a059] hover:bg-[#c5a059]/10
                  transition-colors
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-6 py-10">
              <ul className="space-y-2">
                {nav.map((item, i) => {
                  const active = isActive(item);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.12 + i * 0.06,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          group flex items-center justify-between
                          py-4 border-b border-[#c5a059]/15
                          font-sans uppercase tracking-[0.28em] text-sm
                          ${active ? 'text-[#c5a059]' : 'text-[#c5a059]/70 hover:text-[#c5a059]'}
                          transition-colors
                        `}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="text-[10px] tracking-[0.28em] text-[#c5a059]/50 font-mono">
                            0{i + 1}
                          </span>
                          {item.label}
                        </span>
                        <span
                          aria-hidden
                          className={`block h-px transition-all duration-300 ${
                            active
                              ? 'w-10 bg-[#c5a059]'
                              : 'w-4 bg-[#c5a059]/40 group-hover:w-10 group-hover:bg-[#c5a059]'
                          }`}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Drawer-internal Rezervasyon CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-10"
              >
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="
                    block text-center
                    px-5 py-3
                    border border-[#c5a059] bg-transparent
                    text-[11px] uppercase tracking-[0.28em] font-medium
                    text-[#c5a059]
                    hover:bg-[#c5a059] hover:text-ink-950
                    transition-colors
                  "
                >
                  Rezervasyon
                </Link>
              </motion.div>
            </nav>

            {/* Footer strip — social + copyright */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="px-6 py-6 border-t border-[#c5a059]/15"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c5a059]/60 mb-3">
                Takip Edin
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="
                      inline-flex h-10 w-10 items-center justify-center
                      rounded-full border border-[#c5a059]/50 text-[#c5a059]
                      hover:bg-[#c5a059] hover:text-ink-950
                      hover:border-[#c5a059]
                      transition-colors
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#c5a059]/40">
                © {new Date().getFullYear()} Atelier Lumina · Copenhagen
              </p>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
