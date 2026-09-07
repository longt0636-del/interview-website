'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PlayGlyph, useVideoLightbox } from '@/components/ui/video-testimonial';
import { heroSpotlight } from '@/lib/testimonial-videos';

/**
 * Hero proof stack — the newest student spotlight poster acts as the cover for
 * her video testimonial. The poster art is never covered by an overlay: the
 * caption lives in a navy strip below it, inside the same rounded card.
 */
export function HeroSpotlight() {
  const { open, portal } = useVideoLightbox();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        className="relative mx-auto w-full"
        style={{ maxWidth: 380 }}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Soft brand glow behind the stack */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[32px]"
          style={{
            inset: -18,
            background: 'linear-gradient(135deg, var(--teal) 0%, rgba(93,202,165,0.25) 55%, rgba(239,159,39,0.3) 100%)',
            filter: 'blur(26px)',
            opacity: 0.3,
          }}
        />

        {/* Secondary proof — a real class photo tucked behind, bottom-left */}
        <div
          className="pointer-events-none absolute z-0 hidden overflow-hidden rounded-2xl sm:block"
          style={{
            width: 148,
            left: -58,
            bottom: 54,
            transform: 'rotate(-8deg)',
            border: '3px solid rgba(255,255,255,0.92)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
          }}
        >
          <img
            src="/students/class-group.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
            style={{ aspectRatio: '4 / 5', objectPosition: 'center' }}
          />
        </div>

        {/* Primary — spotlight poster doubles as the video cover */}
        <button
          type="button"
          onClick={() => open(heroSpotlight)}
          aria-label={`Phát video: ${heroSpotlight.name} — ${heroSpotlight.band}. ${heroSpotlight.label}`}
          className="group relative z-10 block w-full cursor-pointer overflow-hidden rounded-3xl text-left transition-transform duration-200 ease-out hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5DCAA5]/60"
          style={{
            border: '2px solid rgba(93,202,165,0.5)',
            boxShadow: '0 28px 64px rgba(0,0,0,0.45)',
            background: 'var(--navy)',
          }}
        >
          <span className="relative block overflow-hidden">
            <img
              src={heroSpotlight.poster}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="block w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              style={{ aspectRatio: '1000 / 1414' }}
            />

            {/* Hover-only dim so the poster art reads at full strength at rest */}
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'rgba(6,32,48,0.18)' }}
            />

            <span className="absolute inset-0 flex items-center justify-center">
              <PlayGlyph />
            </span>

          </span>

          {/* Caption strip — below the artwork, never on top of it */}
          <span className="flex items-center gap-3 px-4 py-3.5" style={{ background: 'var(--navy)' }}>
            <span className="flex-1">
              <span className="block font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--teal-light)' }}>
                Học viên vừa đạt band
              </span>
              <span className="mt-0.5 block font-sans text-sm font-bold leading-snug text-white">
                Nghe {heroSpotlight.shortName ?? heroSpotlight.name} kể lại
                <span className="font-mono font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {' '}· {heroSpotlight.duration}
                </span>
              </span>
            </span>
            <span
              className="shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-bold"
              style={{ background: 'var(--amber)', color: '#3B2400' }}
            >
              {heroSpotlight.band?.replace('IELTS ', '')}
            </span>
          </span>
        </button>

        {/* Floating verification chip */}
        <span
          className="absolute z-20 hidden items-center gap-1.5 rounded-full px-3 py-1.5 sm:inline-flex"
          style={{
            top: -14,
            right: -10,
            background: 'var(--navy)',
            border: '1px solid rgba(93,202,165,0.45)',
            boxShadow: '0 10px 26px rgba(0,0,0,0.4)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="font-sans text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Kết quả thật, người thật
          </span>
        </span>
      </motion.div>
      {portal}
    </>
  );
}
