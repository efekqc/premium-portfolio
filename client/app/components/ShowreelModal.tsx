'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Source MP4. Replace with your own showreel asset. */
  src?: string;
  /** Optional poster image. */
  poster?: string;
}

const DEFAULT_SRC =
  // Stable Google Cloud public sample. Swap for your own reel.
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

export function ShowreelModal({ open, onClose, src = DEFAULT_SRC, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ESC + scroll lock + auto-play
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';

    // Try to play (some browsers require muted for autoplay).
    videoRef.current?.play().catch(() => undefined);

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      videoRef.current?.pause();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="showreel-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Top-right close */}
          <motion.button
            type="button"
            onClick={onClose}
            data-cursor="interactive"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            className="
              absolute top-6 right-6 sm:top-8 sm:right-8
              inline-flex items-center gap-2
              text-[11px] uppercase tracking-[0.22em] text-zinc-300
              hover:text-white transition-colors
            "
            aria-label="Close showreel"
          >
            <span>Close</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-500 hover:border-accent hover:text-accent transition-colors">
              <X className="h-4 w-4" />
            </span>
          </motion.button>

          {/* Top-left brand mark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="
              absolute top-6 left-6 sm:top-8 sm:left-8
              flex items-center gap-3
              text-[11px] uppercase tracking-[0.22em] text-zinc-400
            "
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
            <span>Atelier Lumina · Showreel</span>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92vw] max-w-6xl aspect-video rounded-lg overflow-hidden ring-1 ring-white/10 shadow-2xl bg-ink-900"
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Soft inset gradient for cinema feel */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 pointer-events-none"
            />

            {/* Caption overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent">
                  Twelve Courses
                </p>
                <p className="font-display text-2xl sm:text-3xl text-white mt-1 leading-tight">
                  An evening at the studio<span className="text-accent">.</span>
                </p>
              </div>
              <p className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-zinc-400 shrink-0">
                Press ESC to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
