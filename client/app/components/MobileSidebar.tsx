'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Instagram, Twitter, Facebook } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  isActive: (item: NavItem) => boolean;
}

export function MobileSidebar({ open, onClose, nav, isActive }: Props) {
  // ESC + body scroll lock
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
          {/* Backdrop — separate component so it can fade independently */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-ink-950/70 backdrop-blur-sm md:hidden"
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
              border-r border-accent/20
              md:hidden
            "
          >
            {/* Header strip */}
            <div className="flex items-center justify-between px-6 h-[var(--header-h,72px)] border-b border-accent/10">
              <Link
                href="/"
                onClick={onClose}
                className="font-display italic text-2xl text-white tracking-tight leading-none"
              >
                Lumina<span className="not-italic text-accent">.</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="
                  inline-flex h-9 w-9 items-center justify-center rounded-full
                  border border-accent/30 text-zinc-300
                  hover:border-accent hover:text-white hover:bg-accent/10
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
                          py-4 border-b border-white/[0.06]
                          font-display font-light text-3xl tracking-tight
                          ${active ? 'text-accent' : 'text-zinc-100 hover:text-accent'}
                          transition-colors
                        `}
                      >
                        <span>
                          <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 block mb-1 font-sans">
                            0{i + 1}
                          </span>
                          {item.label}
                        </span>
                        <span
                          aria-hidden
                          className={`block h-px transition-all duration-300 ${
                            active
                              ? 'w-10 bg-accent'
                              : 'w-4 bg-zinc-600 group-hover:w-10 group-hover:bg-accent'
                          }`}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer strip — social + copyright */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="px-6 py-6 border-t border-accent/10"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
                Follow
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="
                      inline-flex h-10 w-10 items-center justify-center
                      rounded-full border border-accent/20 text-zinc-300
                      hover:border-accent hover:text-accent hover:bg-accent/10
                      transition-colors
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                © {new Date().getFullYear()} Atelier Lumina · Copenhagen
              </p>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
