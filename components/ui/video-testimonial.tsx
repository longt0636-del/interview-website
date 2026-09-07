'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type VideoItem = {
  id: string;
  /** Student name shown on the card */
  name: string;
  /** Short form used where the full name would wrap, e.g. the hero caption */
  shortName?: string;
  /** Band badge, e.g. "IELTS 7.5" — omit for group videos */
  band?: string;
  /** One-line description used as the accessible label + modal caption */
  label: string;
  /** Path to the mp4 */
  src: string;
  /** 3:4 still used as the card thumbnail */
  thumb: string;
  /** Full poster shown inside the player before playback */
  poster: string;
  /** Human-readable runtime, e.g. "2:20" */
  duration?: string;
};

/* ── Play button ─────────────────────────────────────────────────────────── */

export function PlayGlyph({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 46 : 60;
  return (
    <span
      className="flex items-center justify-center rounded-full transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-100"
      style={{
        width: box,
        height: box,
        background: 'var(--teal)',
        border: '2px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 28px rgba(11,61,92,0.45)',
      }}
    >
      <svg
        width={size === 'sm' ? 16 : 20}
        height={size === 'sm' ? 16 : 20}
        viewBox="0 0 24 24"
        fill="#fff"
        aria-hidden="true"
        style={{ marginLeft: 2 }}
      >
        <path d="M6.5 4.3a1 1 0 0 1 1.53-.85l11 7.7a1 1 0 0 1 0 1.7l-11 7.7a1 1 0 0 1-1.53-.85V4.3Z" />
      </svg>
    </span>
  );
}

/* ── Modal player ────────────────────────────────────────────────────────── */

function VideoModal({ item, onClose }: { item: VideoItem; onClose: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, video, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(6,32,48,0.9)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
    >
      <motion.div
        ref={panelRef}
        className="relative flex w-full flex-col items-center"
        style={{ maxWidth: 'min(92vw, 460px)' }}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng video"
          className="absolute right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5DCAA5]/60"
          style={{
            top: -56,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.28)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <video
          key={item.id}
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={item.poster}
          className="w-full rounded-2xl"
          style={{ maxHeight: '76vh', background: '#06202f', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
        >
          <source src={item.src} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>

        <p className="mt-4 text-center font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>
          <span className="font-semibold text-white">{item.name}</span>
          {item.band ? <span style={{ color: 'var(--amber)' }}> · {item.band}</span> : null}
          <br />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── Shared lightbox controller ──────────────────────────────────────────── */

export function useVideoLightbox() {
  const [active, setActive] = React.useState<VideoItem | null>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const close = React.useCallback(() => setActive(null), []);

  const portal = mounted
    ? createPortal(
        <AnimatePresence>
          {active ? <VideoModal key={active.id} item={active} onClose={close} /> : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return { open: setActive, portal };
}

/* ── Card ────────────────────────────────────────────────────────────────── */

export function VideoCard({ item, onOpen }: { item: VideoItem; onOpen: (v: VideoItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Phát video: ${item.name}${item.band ? ` — ${item.band}` : ''}. ${item.label}`}
      className={cn(
        'group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl text-left',
        'transition-transform duration-200 ease-out hover:-translate-y-1 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45',
      )}
      style={{ background: 'var(--navy)', boxShadow: '0 6px 24px rgba(11,61,92,0.16)' }}
    >
      {/* Artwork — kept clean; the caption sits below it, not on top of it */}
      <span className="relative block w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
        <img
          src={item.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover-only dim, so posters read at full strength at rest */}
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'rgba(6,32,48,0.18)' }}
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph />
        </span>

        {item.duration ? (
          <span
            className="absolute right-3 top-3 rounded-full px-2.5 py-1 font-mono text-xs"
            style={{ background: 'rgba(6,32,48,0.72)', color: 'rgba(255,255,255,0.92)' }}
          >
            {item.duration}
          </span>
        ) : null}
      </span>

      {/* Caption strip */}
      <span className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-sm font-bold text-white">{item.name}</span>
          {item.band ? (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-xs font-bold"
              style={{ background: 'var(--amber)', color: '#3B2400' }}
            >
              {item.band}
            </span>
          ) : null}
        </span>
        <span className="font-sans text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {item.label}
        </span>
      </span>
    </button>
  );
}

/* ── Grid ────────────────────────────────────────────────────────────────── */

export function VideoCardGrid({ items, className }: { items: VideoItem[]; className?: string }) {
  const { open, portal } = useVideoLightbox();
  return (
    <>
      <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {items.map((item) => (
          <VideoCard key={item.id} item={item} onOpen={open} />
        ))}
      </div>
      {portal}
    </>
  );
}
