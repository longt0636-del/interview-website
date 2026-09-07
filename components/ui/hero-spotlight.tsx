'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PlayGlyph, useVideoLightbox } from '@/components/ui/video-testimonial';
import { heroDeck } from '@/lib/testimonial-videos';

/**
 * Hero proof deck — a slide deck of student spotlight posters. Ngọc Lan leads;
 * visitors reach the rest with the arrows, the dots, arrow keys or a swipe.
 *
 * Two rules carried over from the single-poster version:
 * - The artwork is never covered by an overlay. Caption and controls live in the
 *   navy strip below it, so the "FAVORITE QUOTE" designed into each poster stays
 *   readable.
 * - No video is fetched on page load. Each slide is a still; the mp4 is only
 *   requested once someone actually presses play.
 */

const SWIPE_DISTANCE = 56;
const SWIPE_VELOCITY = 320;

export function HeroSpotlight() {
  const { open, portal } = useVideoLightbox();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  // Bật sau khi trang tải xong: từ lúc đó mới gắn các slide còn lại vào DOM.
  const [preloaded, setPreloaded] = React.useState(false);
  // Một cú vuốt trên nền ảnh vẫn kết thúc bằng sự kiện click, nên nếu không chặn
  // thì vuốt để đổi slide sẽ mở nhầm video.
  const swipedRef = React.useRef(false);

  const total = heroDeck.length;
  const active = heroDeck[index];

  const go = React.useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  // Lượt tải đầu chỉ kéo về poster của slide đầu (giữ LCP nhẹ). Khi trình duyệt
  // rảnh mới nạp nốt các poster khác rồi gắn chúng vào DOM.
  React.useEffect(() => {
    const hasIdle = typeof window !== 'undefined' && 'requestIdleCallback' in window;
    const handle: number = hasIdle
      ? window.requestIdleCallback(preloadRest)
      : window.setTimeout(preloadRest, 1200);

    function preloadRest() {
      heroDeck.slice(1).forEach((item) => {
        const img = new Image();
        img.src = item.thumb;
      });
      setPreloaded(true);
    }

    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  }

  return (
    <>
      <motion.div
        className="relative mx-auto w-full"
        style={{ maxWidth: 380 }}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Video cảm nhận học viên"
        onKeyDown={handleKeyDown}
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

        {/* Primary — the deck itself */}
        <div
          className="relative z-10 overflow-hidden rounded-3xl"
          style={{
            border: '2px solid rgba(93,202,165,0.5)',
            boxShadow: '0 28px 64px rgba(0,0,0,0.45)',
            background: 'var(--navy)',
          }}
        >
          {/* Artwork frame — fixed 3:4 so switching slides never shifts the layout */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
            {/* Cả bộ slide nằm sẵn trong khung, chỉ mờ chồng lên nhau khi đổi.
                Trước đây mỗi lần đổi slide dựng một thẻ <img> mới, trình duyệt phải
                giải mã lại ảnh 900×1200 nên ô tranh trống 1–3 giây rồi ảnh mới hiện.
                Giữ nguyên các thẻ ảnh thì việc giải mã chỉ xảy ra một lần. */}
            {heroDeck.map((item, i) => {
              const current = i === index;
              // Ảnh ngoài slide đầu chỉ được gắn vào DOM sau khi trang tải xong,
              // để lượt tải đầu vẫn chỉ kéo về đúng một tấm poster.
              if (!current && i !== 0 && !preloaded) return null;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  animate={
                    reduceMotion
                      ? { opacity: current ? 1 : 0 }
                      : { opacity: current ? 1 : 0, x: current ? 0 : i < index ? -28 : 28 }
                  }
                  transition={{ duration: reduceMotion ? 0.15 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                  drag={reduceMotion || !current ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  dragSnapToOrigin
                  onDragStart={() => {
                    swipedRef.current = true;
                  }}
                  onDragEnd={(_, info) => {
                    const { offset, velocity } = info;
                    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(index + 1);
                    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(index - 1);
                    // Nhả tay xong mới cho click trở lại, nếu không cú click kết thúc
                    // thao tác vuốt sẽ mở nhầm video.
                    window.setTimeout(() => {
                      swipedRef.current = false;
                    }, 0);
                  }}
                  onClick={() => {
                    if (swipedRef.current) return;
                    open(item);
                  }}
                  aria-hidden={!current}
                  tabIndex={current ? 0 : -1}
                  aria-label={`Phát video: ${item.name}${item.band ? ` — ${item.band}` : ''}. ${item.label}`}
                  className="group absolute inset-0 block w-full cursor-pointer touch-pan-y text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#5DCAA5]/70"
                  style={{ pointerEvents: current ? 'auto' : 'none', zIndex: current ? 2 : 1 }}
                >
                  <img
                    src={item.thumb}
                    alt=""
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    draggable={false}
                    decoding="async"
                    className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
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
                </motion.button>
              );
            })}
          </div>

          {/* Caption + controls — below the artwork, never on top of it */}
          <div className="px-4 pb-3 pt-3.5" style={{ background: 'var(--navy)' }}>
            <div className="flex items-center gap-3" style={{ minHeight: 44 }}>
              <div className="flex-1">
                <span
                  className="block font-sans text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--teal-light)' }}
                >
                  {active.heroEyebrow ?? 'Học viên vừa đạt band'}
                </span>
                <span className="mt-0.5 block font-sans text-sm font-bold leading-snug text-white">
                  {active.heroLine ?? `Nghe ${active.shortName ?? active.name} kể lại`}
                  <span className="font-mono font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {' '}· {active.duration}
                  </span>
                </span>
              </div>
              {active.band ? (
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-bold"
                  style={{ background: 'var(--amber)', color: '#3B2400' }}
                >
                  {active.band.replace('IELTS ', '')}
                </span>
              ) : null}
            </div>

            <div
              className="mt-3 flex items-center justify-between gap-3 border-t pt-2.5"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            >
              <DeckArrow direction="prev" onClick={() => go(index - 1)} />

              <div className="flex items-center gap-2">
                {heroDeck.map((item, i) => {
                  const current = i === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Xem video của ${item.name}`}
                      aria-current={current ? 'true' : undefined}
                      onClick={() => go(i)}
                      className="cursor-pointer rounded-full transition-opacity duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5]/80"
                      style={{
                        width: current ? 22 : 8,
                        height: 8,
                        background: current ? 'var(--teal-light)' : 'rgba(255,255,255,0.32)',
                        opacity: current ? 1 : 0.8,
                      }}
                    />
                  );
                })}
              </div>

              <DeckArrow direction="next" onClick={() => go(index + 1)} />
            </div>
          </div>
        </div>

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

function DeckArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Học viên trước' : 'Học viên tiếp theo'}
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5DCAA5]/80"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(93,202,165,0.35)' }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5DCAA5"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: isPrev ? 'translateX(-1px)' : 'translateX(1px)' }}
      >
        <path d={isPrev ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  );
}
