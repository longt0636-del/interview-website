'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { GridPattern } from '@/components/ui/grid-pattern';
import { StepOneCta } from '@/components/ui/step-one-cta';
import { BookStackIcon, CalendarIcon, HeadphonesIcon, MicIcon, PencilSquareIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

/**
 * Mục "Trang học riêng" (26/10/2026), thay cho mục "Quy trình · Bắt đầu trong 3 bước".
 * Video giới thiệu trang học (dựng bằng /brag) tự chạy không tiếng khi cuộn tới, lặp lại;
 * học sinh bấm vào thì phát lại từ đầu có tiếng. Cuộn qua thì dừng để đỡ tốn pin và 4G.
 *
 * Video nằm ở public/media (không phải public/videos: thư mục đó bị cất ra ngoài lúc dựng bản
 * Cloudflare). cloudflare/worker.ts phát /media/* có tua (Range) để iPhone chạy được.
 */

const VIDEO_SRC = '/media/trang-hoc.mp4';
const POSTER = '/media/trang-hoc-poster.jpg';

const features = [
  {
    Icon: HeadphonesIcon,
    title: 'Reading, Listening làm trên web',
    body: 'Bấm giờ như thi thật, nộp xong biết ngay sai câu nào.',
  },
  {
    Icon: PencilSquareIcon,
    title: 'Thầy chấm ngay trên bài viết',
    body: 'Bôi câu, chọn loại lỗi, nhận xét hiện đúng chỗ em viết sai.',
  },
  {
    Icon: MicIcon,
    title: 'Bài nói tự hiện thành chữ',
    body: 'Ghi âm xong là thấy lại câu mình vừa nói, lỗi được chấm ngay trong câu.',
  },
  {
    Icon: BookStackIcon,
    title: 'Ôn từ vựng như chơi game',
    body: 'Mỗi ngày 10 từ, đến hạn là nhắc ôn, học được thì mua đồ trang trí phòng.',
  },
  {
    Icon: CalendarIcon,
    title: 'Học ngày nào, thầy thấy ngày đó',
    body: 'Có lịch học và bảng xếp hạng lớp, cuối tháng thưởng cho bạn chăm nhất.',
  },
];

export function LearningSiteShowcase({ formUrl }: { formUrl: string }) {
  return (
    <section id="trang-hoc" className="relative scroll-mt-20 overflow-hidden px-6 py-24" style={{ background: 'var(--navy)' }}>
      <GridPattern
        width={40}
        height={40}
        squares={[[3, 2], [8, 6], [15, 3], [19, 11], [5, 15], [12, 18]]}
        className={cn('fill-white/[0.02] stroke-white/[0.05]', '[mask-image:radial-gradient(760px_circle_at_50%_45%,white,transparent)]')}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--teal-light)' }}>
            Trang học riêng
          </p>
          <h2 className="font-serif font-bold leading-tight text-white" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)', textWrap: 'balance' }}>
            Về nhà, học tiếp trên trang học của lớp
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', textWrap: 'pretty' }}>
            Học viên lớp thầy Long làm bài tập về nhà ngay trên web, không cần mật khẩu, chỉ chọn lớp và tên. Xem video ngắn dưới
            đây là biết trang học có gì.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <FeatureList items={features.slice(0, 2)} align="right" className="order-2 lg:order-1" />
          <div className="order-1 flex flex-col items-center gap-3 lg:order-2">
            <ShowcaseVideo />
            {/* Nhạc nền giấy phép CC BY 4.0: bắt buộc ghi tên tác giả */}
            <p className="relative font-sans text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Nhạc: Happy Beats / Business Moves Vol. 1, Sascha Ende (ende.app), CC BY 4.0
            </p>
          </div>
          <FeatureList items={features.slice(2)} align="left" className="order-3" />
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <StepOneCta href={formUrl} />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Điền form xong làm bài kiểm tra trình độ. Thầy Long liên hệ trong 24 giờ để xếp 2 buổi học thử miễn phí.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureList({
  items,
  align,
  className,
}: {
  items: typeof features;
  align: 'left' | 'right';
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-col gap-7', className)}>
      {items.map(({ Icon, title, body }) => (
        <li key={title} className={cn('flex items-start gap-4', align === 'right' && 'lg:flex-row-reverse lg:text-right')}>
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(93,202,165,0.14)', color: 'var(--teal-light)', border: '1px solid rgba(93,202,165,0.25)' }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block font-sans text-base font-semibold leading-snug text-white">{title}</span>
            <span className="mt-1 block font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
              {body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ShowcaseVideo() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [load, setLoad] = React.useState(false); // chỉ tải video khi sắp cuộn tới
  const [visible, setVisible] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoad(true);
        setVisible(entry.intersectionRatio >= 0.35);
      },
      { rootMargin: '300px 0px', threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tự chạy (không tiếng) khi khung video lọt vào màn hình, dừng khi cuộn qua.
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !load) return;
    if (visible && (!reduce || soundOn)) {
      if (!soundOn) v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, load, reduce, soundOn]);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    if (!soundOn) {
      setLoad(true);
      v.muted = false;
      v.currentTime = 0;
      v.play().catch(() => {});
      setSoundOn(true);
    } else {
      v.muted = true;
      setSoundOn(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* Quầng sáng sau video */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(29,158,117,0.45), transparent)' }}
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? 'Tắt tiếng video giới thiệu trang học' : 'Phát lại video giới thiệu trang học, có tiếng'}
        className={cn(
          'group relative block w-[min(84vw,340px)] cursor-pointer overflow-hidden rounded-[1.75rem] lg:w-[350px]',
          'transition-transform duration-200 ease-out active:scale-[0.99]',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5DCAA5]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B3D5C]',
        )}
        style={{
          aspectRatio: '9 / 16',
          background: '#06202F',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 0 6px rgba(255,255,255,0.04)',
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={load ? VIDEO_SRC : undefined}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Nút tiếng ở chân video */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
          <span
            className="flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-semibold transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
            style={{
              background: soundOn ? 'rgba(6,32,47,0.72)' : 'var(--amber)',
              color: soundOn ? '#fff' : '#3B2400',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              backdropFilter: soundOn ? 'blur(6px)' : undefined,
            }}
          >
            {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
            {soundOn ? 'Đang có tiếng · bấm để tắt' : !playing && reduce ? 'Bấm để xem, có tiếng' : 'Bấm để nghe tiếng'}
          </span>
        </span>
      </button>
    </div>
  );
}

function SoundOffIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function SoundOnIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}
