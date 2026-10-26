'use client';

import * as React from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { courses, type Course } from '@/lib/courses';
import { StepOneCta } from '@/components/ui/step-one-cta';
import { cn } from '@/lib/utils';

/**
 * Con đường lộ trình (26/10/2026, bản 2 theo bản mẫu Long gửi): đường uốn lượn từ "Bây giờ 0" tới
 * "Mục tiêu 6.0-7.0+", có núi, cây, cờ xuất phát và cúp ở đích (vẽ bằng SVG, không dùng ảnh).
 * Rê chuột (máy tính) hoặc chạm (điện thoại) vào một chặng → thẻ của chặng đó bật ra ngay bên dưới
 * (chỉ một thẻ mỗi lần, thay cho 3 thẻ xếp sẵn). Bấm "Đúng mình rồi, xem thêm" → mở chi tiết trong thẻ,
 * có brochure Canva xem ngay trong trang.
 */

const EASE = [0.23, 1, 0.32, 1] as const;
const DRAW = 1.6; // giây để con đường vẽ xong

type Pt = [number, number];
type Layout = {
  w: number;
  h: number;
  road: string;
  segs: string[];
  nodes: Pt[];
  mids: Pt[];
  chipDrop: number; // nút tên chặng nằm dưới đường bao nhiêu đơn vị
  roadWidth: number;
  hitWidth: number;
};

// Máy tính / máy tính bảng: đường ngang rộng, đủ chỗ cho núi, cây, cúp.
const WIDE: Layout = {
  w: 1200,
  h: 340,
  road: 'M90 268 C200 290 330 170 430 168 C530 166 560 262 640 258 C720 254 740 152 820 150 C900 148 920 246 985 238 C1050 230 1060 170 1110 168',
  segs: [
    'M90 268 C200 290 330 170 430 168',
    'M430 168 C530 166 560 262 640 258 C720 254 740 152 820 150',
    'M820 150 C900 148 920 246 985 238 C1050 230 1060 170 1110 168',
  ],
  nodes: [
    [90, 268],
    [430, 168],
    [820, 150],
    [1110, 168],
  ],
  mids: [
    [264, 227],
    [640, 258],
    [985, 238],
  ],
  chipDrop: 46,
  roadWidth: 26,
  hitWidth: 80,
};

// Điện thoại: cùng dáng đường nhưng gọn, ít đồ trang trí hơn.
const NARROW: Layout = {
  w: 400,
  h: 240,
  road: 'M30 185 C70 200 105 107 140 105 C175 103 180 177 205 175 C230 173 235 97 262 95 C290 93 300 163 318 160 C340 157 350 107 370 105',
  segs: [
    'M30 185 C70 200 105 107 140 105',
    'M140 105 C175 103 180 177 205 175 C230 173 235 97 262 95',
    'M262 95 C290 93 300 163 318 160 C340 157 350 107 370 105',
  ],
  nodes: [
    [30, 185],
    [140, 105],
    [262, 95],
    [370, 105],
  ],
  mids: [
    [87, 151],
    [205, 175],
    [318, 160],
  ],
  chipDrop: 36,
  roadWidth: 18,
  hitWidth: 56,
};

const NODE_CAPTION = ['Bây giờ', 'Chặng 2', 'Chặng 3', 'Mục tiêu'];
const NODE_BAND = [courses[0].from, ...courses.map((c) => c.to)];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function CourseRoadmap({ formUrl }: { formUrl: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.25 });
  const shown = inView || reduce;

  const [active, setActive] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false); // chi tiết trong thẻ

  // Rê chuột: chỉ đổi chặng khi chi tiết đang đóng, kẻo kéo chuột xuống thẻ lướt qua chặng khác là mất thẻ đang đọc.
  const preview = (i: number) => {
    if (open || active === i) return;
    setActive(i);
  };
  const choose = (i: number) => {
    if (active !== i) {
      setActive(i);
      setOpen(false);
    }
    // Chạm trên điện thoại: thẻ có thể nằm dưới mép màn hình, kéo lên cho thấy.
    window.setTimeout(() => {
      const el = cardRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.72) {
        window.scrollTo({ top: window.scrollY + top - window.innerHeight * 0.35, behavior: reduce ? 'auto' : 'smooth' });
      }
    }, 160);
  };

  const course = active === null ? null : courses[active];

  return (
    <div ref={rootRef}>
      <div className="hidden md:block">
        <PathStage layout={WIDE} wide active={active} shown={shown} reduce={reduce} onPreview={preview} onChoose={choose} />
      </div>
      <div className="md:hidden">
        <PathStage layout={NARROW} wide={false} active={active} shown={shown} reduce={reduce} onPreview={preview} onChoose={choose} />
      </div>

      {/* Thẻ của chặng đang chọn bật ra ngay dưới con đường */}
      <div ref={cardRef} id="lo-trinh-the" className="relative mt-4 scroll-mt-24" aria-live="polite">
        {course && active !== null ? (
          <>
            <Caret index={active} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.26, ease: EASE }}
                className="pt-2.5"
              >
                <CourseCard
                  course={course}
                  index={active}
                  open={open}
                  onToggle={() => setOpen((v) => !v)}
                  formUrl={formUrl}
                  reduce={reduce}
                />
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            className="mx-auto flex max-w-xl items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-5 py-4 text-center font-sans text-sm"
            style={{ borderColor: 'rgba(29,158,117,0.35)', color: 'var(--navy)' }}
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={shown ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: reduce ? 0 : DRAW }}
          >
            <PointerIcon />
            <span>
              <b>Rê chuột hoặc chạm vào một chặng</b> trên con đường. Chặng nào nghe giống bạn nhất?
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Mũi nhọn của thẻ, chỉ lên đúng chặng đang chọn ───────────────────────── */

function Caret({ index }: { index: number }) {
  return (
    <>
      <motion.span
        layout
        aria-hidden="true"
        className="absolute top-0 hidden h-5 w-5 -translate-x-1/2 rotate-45 rounded-sm bg-white md:block"
        style={{ left: pct(WIDE.mids[index][0], WIDE.w), borderLeft: '1px solid var(--mint)', borderTop: '1px solid var(--mint)', zIndex: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
      <motion.span
        layout
        aria-hidden="true"
        className="absolute top-0 h-5 w-5 -translate-x-1/2 rotate-45 rounded-sm bg-white md:hidden"
        style={{ left: pct(NARROW.mids[index][0], NARROW.w), borderLeft: '1px solid var(--mint)', borderTop: '1px solid var(--mint)', zIndex: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </>
  );
}

/* ── Con đường + trang trí + mốc + nút từng chặng ─────────────────────────── */

function PathStage({
  layout: L,
  wide,
  active,
  shown,
  reduce,
  onPreview,
  onChoose,
}: {
  layout: Layout;
  wide: boolean;
  active: number | null;
  shown: boolean;
  reduce: boolean;
  onPreview: (i: number) => void;
  onChoose: (i: number) => void;
}) {
  const id = wide ? 'w' : 'n';
  const segDelay = (i: number) => (reduce ? 0 : 0.2 + ((i + 1) / courses.length) * DRAW);

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full" role="img" aria-label="Con đường từ mất gốc tới mục tiêu 6.0 đến 7.0+, chia thành 3 chặng">
        <defs>
          <linearGradient id={`soft-${id}`} x1="0" x2={L.w} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A9DEC6" />
            <stop offset="0.55" stopColor="#BFE3B4" />
            <stop offset="1" stopColor="#F3D58E" />
          </linearGradient>
          <linearGradient id={`strong-${id}`} x1="0" x2={L.w} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3DB88C" />
            <stop offset="0.55" stopColor="#1D9E75" />
            <stop offset="1" stopColor="#EF9F27" />
          </linearGradient>
        </defs>

        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={shown ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {wide ? <WideScenery /> : <NarrowScenery />}
        </motion.g>

        {/* Lề đường + mặt đường (vẽ dần khi cuộn tới) */}
        <motion.path
          d={L.road}
          fill="none"
          stroke="#DCEFE5"
          strokeWidth={L.roadWidth + 10}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={shown ? { pathLength: 1 } : undefined}
          transition={{ duration: reduce ? 0 : DRAW, ease: EASE, delay: 0.2 }}
        />
        <motion.path
          d={L.road}
          fill="none"
          stroke={`url(#soft-${id})`}
          strokeWidth={L.roadWidth}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={shown ? { pathLength: 1 } : undefined}
          transition={{ duration: reduce ? 0 : DRAW, ease: EASE, delay: 0.2 }}
        />

        {/* Chặng đang chọn: đậm màu + quầng sáng */}
        {courses.map((c, i) => (
          <g key={c.id} style={{ opacity: active === i ? 1 : 0, transition: 'opacity 220ms ease-out' }}>
            <path d={L.segs[i]} fill="none" stroke="#EF9F27" strokeOpacity={0.22} strokeWidth={L.roadWidth + 22} strokeLinecap="round" />
            <path d={L.segs[i]} fill="none" stroke={`url(#strong-${id})`} strokeWidth={L.roadWidth} strokeLinecap="round" />
          </g>
        ))}

        {/* Vạch giữa đường */}
        <motion.path
          d={L.road}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.9}
          strokeWidth={wide ? 3 : 2}
          strokeDasharray={wide ? '14 12' : '8 7'}
          strokeLinecap="round"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={shown ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: reduce ? 0 : DRAW }}
        />

        {/* Mốc band */}
        {L.nodes.map(([x, y], i) => {
          const last = i === L.nodes.length - 1;
          const lit = active !== null && (i === active || i === active + 1);
          return (
            <motion.g
              key={i}
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.8 }}
              animate={shown ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.2 + (i / courses.length) * DRAW }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle cx={x} cy={y} r={wide ? 15 : 10} fill="#fff" stroke={lit || last ? '#EF9F27' : '#1D9E75'} strokeWidth={wide ? 5 : 4} />
              <circle cx={x} cy={y} r={wide ? 5 : 3.5} fill={lit || last ? '#EF9F27' : '#1D9E75'} />
            </motion.g>
          );
        })}

        {/* Vùng rê chuột / chạm của từng chặng (to hơn mặt đường cho dễ trúng) */}
        {courses.map((c, i) => (
          <path
            key={c.id}
            d={L.segs[i]}
            fill="none"
            stroke="transparent"
            strokeWidth={L.hitWidth}
            strokeLinecap="round"
            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
            onMouseEnter={() => onPreview(i)}
            onClick={() => onChoose(i)}
            aria-hidden="true"
          />
        ))}
      </svg>

      {/* Nhãn mốc band (chữ thật, không vẽ vào hình) */}
      {L.nodes.map(([x, y], i) => {
        const last = i === L.nodes.length - 1;
        const first = i === 0;
        return (
          <motion.div
            key={i}
            className="pointer-events-none absolute flex w-max flex-col items-center whitespace-nowrap"
            style={{
              left: pct(x, L.w),
              top: last && wide ? '0%' : pct(y, L.h),
              transform: `translate(${first && !wide ? '-25%' : last ? '-78%' : '-50%'}, ${last && wide ? '0' : 'calc(-100% - ' + (wide ? 24 : 16) + 'px)'})`,
            }}
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={shown ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.3 + (i / courses.length) * DRAW }}
          >
            <span
              className={cn('rounded-full font-sans font-bold uppercase', wide ? 'px-3 py-1 text-[11px] tracking-[0.14em]' : 'px-2 py-0.5 text-[9px] tracking-[0.1em]')}
              style={{ background: last ? 'var(--amber)' : 'var(--mint)', color: last ? '#3B2400' : 'var(--teal)' }}
            >
              {NODE_CAPTION[i]}
            </span>
            <span
              className={cn('-mt-0.5 rounded-2xl bg-white font-mono font-bold leading-none', wide ? 'px-3.5 py-2 text-2xl' : 'px-2 py-1 text-sm')}
              style={{ color: last ? '#C77A0E' : 'var(--navy)', boxShadow: '0 4px 14px rgba(11,61,92,0.10)' }}
            >
              {NODE_BAND[i]}
            </span>
          </motion.div>
        );
      })}

      {/* Biển "Bạn đang ở đâu?" ở điểm xuất phát */}
      {wide ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: '0.5%', top: '20%' }}
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -8 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.1 }}
        >
          <span
            className="block -rotate-6 rounded-xl px-3.5 py-2 font-sans text-sm font-bold text-white"
            style={{ background: 'var(--navy)', boxShadow: '0 8px 20px rgba(11,61,92,0.25)' }}
          >
            Bạn đang ở đâu?
          </span>
        </motion.div>
      ) : null}

      {/* Nút tên chặng: bấm/rê vào đây cũng như rê vào đường */}
      {courses.map((c, i) => {
        const [x, y] = L.mids[i];
        const isActive = active === i;
        return (
          <motion.div
            key={c.id}
            className="absolute"
            style={{ left: pct(x, L.w), top: pct(y + L.chipDrop, L.h), transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={shown ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, ease: EASE, delay: segDelay(i) }}
          >
            <button
              type="button"
              onMouseEnter={() => onPreview(i)}
              onClick={() => onChoose(i)}
              aria-pressed={isActive}
              aria-controls="lo-trinh-the"
              className={cn(
                'relative inline-flex min-h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full font-sans font-bold',
                'transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45',
                wide ? 'px-4 py-2 text-sm' : 'px-2.5 py-1.5 text-[11px]',
              )}
              style={
                isActive
                  ? { background: 'var(--amber)', color: '#3B2400', boxShadow: '0 8px 20px rgba(239,159,39,0.35)' }
                  : { background: '#fff', color: 'var(--teal)', boxShadow: '0 4px 14px rgba(11,61,92,0.12)', border: '1.5px solid rgba(29,158,117,0.35)' }
              }
            >
              {active === null ? <span aria-hidden="true" className="chip-ring" /> : null}
              {wide ? <span style={{ opacity: 0.7 }}>Chặng {i + 1} ·</span> : null}
              {c.short}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Thẻ chặng ────────────────────────────────────────────────────────────── */

const HL_TITLE = 'linear-gradient(transparent 60%, rgba(93,202,165,0.45) 60%)';
const HL_HEADING = 'linear-gradient(transparent 55%, rgba(239,159,39,0.38) 55%)';

function CourseCard({
  course,
  index,
  open,
  onToggle,
  formUrl,
  reduce,
}: {
  course: Course;
  index: number;
  open: boolean;
  onToggle: () => void;
  formUrl: string;
  reduce: boolean;
}) {
  const [brochureOpen, setBrochureOpen] = React.useState(false);
  const band = course.from === '0' ? 'Mất gốc' : course.from;

  return (
    <div
      className="relative rounded-3xl bg-white p-5 sm:p-7"
      style={{ boxShadow: '0 14px 44px rgba(11,61,92,0.12)', border: '1px solid var(--mint)' }}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="min-w-0">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-sm font-bold"
            style={{ background: 'rgba(239,159,39,0.16)', color: '#B36A06' }}
          >
            <span className={course.from === '0' ? 'font-sans' : undefined}>{band}</span> → {course.to}
          </span>
          <h3 className="mt-3 font-serif text-3xl font-bold leading-tight" style={{ color: 'var(--navy)' }}>
            <span className="px-1" style={{ background: HL_TITLE, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
              {course.name}
            </span>
          </h3>
          <p className="mt-2 font-sans text-[15px] leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.78 }}>
            {course.tagline}
          </p>
          <ToggleButton open={open} onToggle={onToggle} className="mt-5 hidden lg:inline-flex" id={course.id} />
        </div>

        <div className="min-w-0">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--teal)' }}>
            Nghe có giống bạn không?
          </p>
          <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {course.signs.map((s, k) => (
              <motion.li
                key={s}
                className="flex items-start gap-2.5 rounded-2xl rounded-tl-md px-3.5 py-2.5 font-sans text-sm leading-snug"
                style={{ background: 'var(--off-white)', border: '1px solid var(--mint)', color: 'var(--ink)' }}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE, delay: reduce ? 0 : 0.05 + k * 0.05 }}
              >
                <CheckDot />
                <span>&ldquo;{s}&rdquo;</span>
              </motion.li>
            ))}
          </ul>
          <ToggleButton open={open} onToggle={onToggle} className="mt-5 inline-flex lg:hidden" id={course.id} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="chi-tiet"
            id={`chi-tiet-${course.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            className="mt-7 border-t pt-7"
            style={{ borderColor: 'var(--mint)' }}
          >
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
              <div className="min-w-0">
                <Heading>Dành cho bạn nào</Heading>
                <p className="mt-2 max-w-[62ch] font-sans text-[15px] leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.85 }}>
                  {course.forWho}
                </p>

                <Heading className="mt-7">Học gì</Heading>
                <TickList items={course.learn} />

                <Heading className="mt-7">Học xong</Heading>
                <TickList items={course.outcomes} />
              </div>

              <aside className="flex min-w-0 flex-col gap-5">
                <dl>
                  {course.facts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 border-b py-2.5" style={{ borderColor: 'var(--mint)' }}>
                      <dt className="shrink-0 font-sans text-xs uppercase tracking-wider" style={{ color: 'var(--ink)', opacity: 0.55 }}>
                        {f.label}
                      </dt>
                      <dd className="text-right font-sans text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-2xl px-5 py-4" style={{ background: '#147767' }}>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Học phí
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-mono text-2xl font-bold" style={{ color: 'var(--amber)' }}>
                      {course.price}đ
                    </span>
                    <span className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      /tháng
                    </span>
                    <span className="font-mono text-sm line-through" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {course.oldPrice}đ
                    </span>
                    <span className="rounded-full px-2 py-0.5 font-sans text-[11px] font-bold" style={{ background: 'rgba(239,159,39,0.22)', color: 'var(--amber)' }}>
                      -{course.savings}
                    </span>
                  </p>
                  <p className="mt-2 font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Học thử 2 buổi miễn phí trước khi đóng học phí.
                  </p>
                </div>

                <StepOneCta href={formUrl} compact className="w-full" />

                <button
                  type="button"
                  onClick={() => setBrochureOpen((v) => !v)}
                  aria-expanded={brochureOpen}
                  aria-controls={`brochure-${course.id}`}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 font-sans text-sm font-bold transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
                  style={{ background: 'var(--mint)', color: 'var(--navy)', border: '1px solid rgba(29,158,117,0.3)' }}
                >
                  <BookIcon />
                  {brochureOpen ? 'Ẩn brochure' : 'Xem brochure ngay tại đây'}
                </button>
              </aside>
            </div>

            {brochureOpen ? (
              <div id={`brochure-${course.id}`} className="mt-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Heading>Brochure {course.name}</Heading>
                  <a
                    href={course.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md font-sans text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
                    style={{ color: 'var(--teal)' }}
                  >
                    Mở toàn màn hình
                    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 7h10v10M7 17 17 7" />
                    </svg>
                  </a>
                </div>
                <div
                  className="mt-3 overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '16 / 9', background: 'var(--off-white)', border: '1px solid var(--mint)' }}
                >
                  <iframe
                    src={course.brochureEmbed}
                    title={`Brochure khoá ${course.name}`}
                    loading="lazy"
                    allowFullScreen
                    allow="fullscreen"
                    className="h-full w-full border-0"
                  />
                </div>
                <p className="mt-2 font-sans text-xs" style={{ color: 'var(--ink)', opacity: 0.6 }}>
                  Bấm mũi tên dưới brochure để lật trang.
                </p>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">Chặng {index + 1}</span>
    </div>
  );
}

function ToggleButton({ open, onToggle, className, id }: { open: boolean; onToggle: () => void; className?: string; id: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`chi-tiet-${id}`}
      className={cn(
        'min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-sans text-sm font-semibold',
        'transition-transform duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45',
        className,
      )}
      style={
        open
          ? { background: 'var(--mint)', color: 'var(--navy)' }
          : { background: 'var(--teal)', color: '#fff', boxShadow: '0 6px 18px rgba(29,158,117,0.28)' }
      }
    >
      {open ? 'Thu gọn' : 'Đúng mình rồi, xem thêm'}
      <svg
        aria-hidden="true"
        className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}

function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h4 className={cn('font-sans text-base font-extrabold', className)} style={{ color: 'var(--navy)' }}>
      <span className="px-1" style={{ background: HL_HEADING }}>
        {children}
      </span>
    </h4>
  );
}

function TickList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2.5 flex flex-col gap-2">
      {items.map((o) => (
        <li key={o} className="flex items-start gap-2.5 font-sans text-[15px] leading-snug" style={{ color: 'var(--ink)' }}>
          <CheckDot />
          {o}
        </li>
      ))}
    </ul>
  );
}

function CheckDot() {
  return (
    <span aria-hidden="true" className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--teal)', color: '#fff' }}>
      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

function PointerIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="#fff" stroke="var(--teal)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3.5a1.5 1.5 0 0 1 3 0V9.5a1.5 1.5 0 0 1 3 0V10.5a1.5 1.5 0 0 1 3 0V11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-1.5c-2.2 0-3.6-.8-4.8-2l-3.4-3.6a1.5 1.5 0 0 1 2.1-2.1L7 15.5Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

/* ── Trang trí (SVG phẳng theo màu thương hiệu) ───────────────────────────── */

const G1 = '#2E8B68';
const G2 = '#1F7356';
const G3 = '#6CC79F';
const HILL = '#CFEBDD';
const CLOUD = '#E2EEE8';

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g fill={CLOUD} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="10" rx="46" ry="14" />
      <circle cx="-16" cy="2" r="16" />
      <circle cx="12" cy="-2" r="20" />
    </g>
  );
}

function RoundTree({ x, y, s = 1, light = false }: { x: number; y: number; s?: number; light?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="-6" width="5" height="18" rx="2" fill="#7A6A4F" />
      <ellipse cx="0" cy="-18" rx="13" ry="17" fill={light ? G3 : '#3BA57E'} />
      <ellipse cx="4" cy="-22" rx="6" ry="8" fill="#fff" opacity="0.12" />
    </g>
  );
}

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-4" width="4" height="12" fill="#6B5B42" />
      <polygon points="0,-46 -14,-14 14,-14" fill={G1} />
      <polygon points="0,-34 -17,-2 17,-2" fill={G2} />
    </g>
  );
}

function Mountain({ x, y, s = 1, flag = false }: { x: number; y: number; s?: number; flag?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="120" ry="16" fill={HILL} />
      <polygon points="-95,0 -40,-72 15,0" fill={G3} />
      <polygon points="-40,0 25,-112 90,0" fill={G1} />
      <polygon points="25,-112 90,0 40,0" fill={G2} />
      <polygon points="25,-112 12,-88 20,-92 27,-84 33,-92 38,-89" fill="#fff" opacity="0.85" />
      {flag ? (
        <>
          <line x1="25" y1="-112" x2="25" y2="-140" stroke="#0B3D5C" strokeWidth="2.5" />
          <polygon points="25,-140 46,-133 25,-126" fill="#EF9F27" />
        </>
      ) : null}
    </g>
  );
}

function Trophy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* tia sáng */}
      <g stroke="#EF9F27" strokeWidth="4" strokeLinecap="round">
        <line x1="-44" y1="-34" x2="-56" y2="-42" />
        <line x1="-48" y1="-12" x2="-62" y2="-12" />
        <line x1="44" y1="-34" x2="56" y2="-42" />
        <line x1="48" y1="-12" x2="62" y2="-12" />
      </g>
      <path d="M-30 -40 C-46 -40 -46 -14 -24 -12" fill="none" stroke="#D98A1A" strokeWidth="6" />
      <path d="M30 -40 C46 -40 46 -14 24 -12" fill="none" stroke="#D98A1A" strokeWidth="6" />
      <path d="M-28 -46 H28 V-26 A28 28 0 0 1 -28 -26 Z" fill="#EF9F27" />
      <path d="M8 -46 H28 V-26 A28 28 0 0 1 4 1 Z" fill="#D98A1A" opacity="0.35" />
      <polygon points="0,-38 4,-29 14,-29 6,-23 9,-14 0,-19 -9,-14 -6,-23 -14,-29 -4,-29" fill="#fff" />
      <rect x="-6" y="0" width="12" height="12" fill="#D98A1A" />
      <rect x="-20" y="12" width="40" height="9" rx="3" fill="#B36A06" />
    </g>
  );
}

function StartFlag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="6" cy="2" rx="60" ry="14" fill={HILL} />
      <line x1="0" y1="0" x2="0" y2="-74" stroke="#0B3D5C" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 -72 L-38 -60 L0 -46 Z" fill="#1D9E75" />
    </g>
  );
}

function WideScenery() {
  return (
    <g>
      <Cloud x={300} y={58} />
      <Cloud x={735} y={92} s={0.75} />
      <Cloud x={1000} y={50} s={0.9} />
      <Cloud x={175} y={128} s={0.6} />

      <Mountain x={630} y={236} flag />
      <Pine x={512} y={176} s={1.1} />
      <RoundTree x={540} y={190} s={1.1} light />
      <Pine x={885} y={128} s={1.05} />
      <RoundTree x={915} y={140} light />
      <Pine x={950} y={140} s={0.9} />

      {/* Núi đích */}
      <polygon points="1022,340 1110,182 1200,340" fill={G1} />
      <polygon points="1110,182 1200,340 1128,340" fill={G2} />
      <ellipse cx="1150" cy="330" rx="90" ry="16" fill={HILL} />
      <Trophy x={1110} y={134} s={0.82} />

      <StartFlag x={44} y={262} />
      <RoundTree x={300} y={318} s={0.8} light />
      <RoundTree x={760} y={318} s={0.85} />
      <ellipse cx="1000" cy="268" rx="12" ry="7" fill="#B9C9C1" />
      <ellipse cx="1012" cy="272" rx="7" ry="4.5" fill="#CBD8D1" />
    </g>
  );
}

function NarrowScenery() {
  return (
    <g>
      <Cloud x={95} y={40} s={0.55} />
      <Cloud x={300} y={30} s={0.5} />
      <Mountain x={205} y={160} s={0.42} flag />
      <RoundTree x={330} y={196} s={0.6} light />
      <polygon points="335,240 370,118 400,240" fill={G1} opacity="0.9" />
      <StartFlag x={22} y={183} s={0.55} />
    </g>
  );
}
