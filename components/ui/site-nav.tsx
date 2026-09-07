'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const links = [
  { href: '#courses', label: 'Khóa học' },
  { href: '#testimonials', label: 'Học viên' },
  { href: '#how', label: 'Quy trình' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteNav({ formUrl }: { formUrl: string }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape or when the viewport grows past the breakpoint
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  // Over the navy hero the bar is transparent with light text; once scrolled it
  // becomes an opaque white bar so body content stays readable behind it.
  const onDark = !scrolled && !menuOpen;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: onDark ? 'transparent' : 'rgba(255,255,255,0.94)',
        backdropFilter: onDark ? 'none' : 'blur(10px)',
        borderBottom: onDark ? '1px solid transparent' : '1px solid rgba(11,61,92,0.08)',
        boxShadow: onDark ? 'none' : '0 2px 16px rgba(11,61,92,0.06)',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Điều hướng chính">
        <Link
          href="/"
          className="flex min-h-11 items-center rounded-md font-serif text-xl font-bold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
          style={{ color: onDark ? '#fff' : 'var(--navy)' }}
        >
          Long<span style={{ color: onDark ? 'var(--teal-light)' : 'var(--teal)' }}>IELTS</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 font-sans text-sm md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex min-h-11 items-center rounded-md px-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
              style={{ color: onDark ? 'rgba(255,255,255,0.85)' : 'var(--ink)' }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-5 py-2.5 font-sans text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45 sm:inline-block"
            style={{ background: 'var(--teal)' }}
          >
            Đăng ký ngay ↗
          </a>

          {/* Mobile menu toggle — 44px touch target */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45 md:hidden"
            style={{
              color: onDark ? '#fff' : 'var(--navy)',
              background: onDark ? 'rgba(255,255,255,0.1)' : 'var(--mint)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: '#fff', borderTop: '1px solid rgba(11,61,92,0.08)' }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex min-h-11 items-center rounded-xl px-3 font-sans text-base',
                    'transition-colors hover:bg-[var(--mint)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45',
                  )}
                  style={{ color: 'var(--navy)' }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex min-h-11 items-center justify-center rounded-xl px-4 font-sans text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
                style={{ background: 'var(--teal)' }}
              >
                Đăng ký ngay ↗
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
