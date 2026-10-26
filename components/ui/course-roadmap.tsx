'use client';

import * as React from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { courses, type Course } from '@/lib/courses';
import { StepOneCta } from '@/components/ui/step-one-cta';
import { cn } from '@/lib/utils';

/**
 * Lộ trình 3 khoá (26/10/2026), thay cho 3 thẻ khoá học bấm ra brochure Canva.
 * Một đường đi từ "Bây giờ" tới "Mục tiêu 7.0+": khi cuộn tới thì đường tự vẽ, các mốc band
 * hiện lần lượt. Mỗi chặng có vài câu học sinh ở trình độ đó hay nghĩ trong đầu; bấm vào chặng
 * nào thì chi tiết khoá đó mở ngay trên trang (máy tính: khung bên dưới; điện thoại: ngay dưới chặng).
 */

const EASE = [0.23, 1, 0.32, 1] as const;
const NODES = [courses[0].from, ...courses.map((c) => c.to)];
const DRAW = 1.4; // giây để đường lộ trình vẽ từ đầu tới đích

export function CourseRoadmap({ formUrl }: { formUrl: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.05 });
  const desktopPanelRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | null>(null);
  // Máy tính: 3 chặng nằm ngang nên hiện lần lượt theo đường vẽ; điện thoại: chặng nào cuộn tới thì hiện ngay.
  const [wide, setWide] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const activeIndex = courses.findIndex((c) => c.id === active);
  const activeCourse = activeIndex >= 0 ? courses[activeIndex] : null;
  const shown = inView || reduce;

  const toggle = (id: string) => setActive((cur) => (cur === id ? null : id));

  // Chọn xong thì đưa phần chi tiết vào tầm mắt nếu nó đang nằm dưới mép màn hình.
  React.useEffect(() => {
    if (!active) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    const target = desktop ? desktopPanelRef.current : document.getElementById(`chang-${active}`);
    if (!target) return;
    const timer = window.setTimeout(() => {
      const top = target.getBoundingClientRect().top;
      const tooLow = desktop ? top > window.innerHeight * 0.62 : top > window.innerHeight * 0.45 || top < 64;
      if (tooLow) {
        window.scrollTo({ top: window.scrollY + top - 88, behavior: reduce ? 'auto' : 'smooth' });
      }
    }, 140);
    return () => window.clearTimeout(timer);
  }, [active, reduce]);

  return (
    <div ref={rootRef}>
      {/* ── Đường lộ trình ngang (máy tính) ── */}
      <div className="relative mx-4 mb-10 hidden h-24 lg:block" aria-hidden="true">
        <div className="absolute inset-x-0 top-[58px] h-1.5 rounded-full" style={{ background: 'rgba(11,61,92,0.10)' }} />
        <motion.div
          className="absolute inset-x-0 top-[58px] h-1.5 origin-left rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--teal-light), var(--teal) 55%, var(--amber))' }}
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: shown ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DRAW, ease: EASE, delay: 0.15 }}
        />
        {/* Đoạn của chặng đang chọn sáng lên */}
        {courses.map((c, i) => (
          <div
            key={c.id}
            className="absolute top-[54px] h-3.5 rounded-full transition-opacity duration-300"
            style={{
              left: `${(i / courses.length) * 100}%`,
              width: `${100 / courses.length}%`,
              background: 'var(--amber)',
              boxShadow: '0 0 0 4px rgba(239,159,39,0.18)',
              opacity: activeIndex === i ? 1 : 0,
            }}
          />
        ))}

        {NODES.map((band, i) => {
          const last = i === NODES.length - 1;
          return (
            <div
              key={band}
              className="absolute top-0 flex w-max -translate-x-1/2 flex-col items-center whitespace-nowrap"
              style={{ left: `${(i / courses.length) * 100}%` }}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.95, y: reduce ? 0 : 6 }}
                animate={shown ? { opacity: 1, scale: 1, y: 0 } : undefined}
                transition={{ duration: reduce ? 0 : 0.45, ease: EASE, delay: reduce ? 0 : 0.15 + (i / courses.length) * DRAW }}
              >
                <span className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--teal)' }}>
                  {i === 0 ? 'Bây giờ' : last ? 'Mục tiêu' : `Chặng ${i + 1}`}
                </span>
                <span
                  className={cn('font-mono font-bold leading-none', last ? 'text-2xl' : 'text-xl')}
                  style={{ color: last ? 'var(--amber)' : 'var(--navy)' }}
                >
                  {band}
                </span>
                <span
                  className="mt-2 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: last ? 'var(--amber)' : '#fff',
                    border: `3px solid ${last ? 'var(--amber)' : i <= activeIndex ? 'var(--amber)' : 'var(--teal)'}`,
                    boxShadow: '0 2px 10px rgba(11,61,92,0.16)',
                  }}
                >
                  {last ? <FlagIcon /> : null}
                </span>
              </motion.div>
              {/* "Bạn ở đây": nằm ở mốc xuất phát của chặng đang chọn */}
              {i === Math.max(activeIndex, 0) ? (
                <motion.span
                  layoutId="ban-o-day"
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                  className={cn(
                    'absolute top-[88px] whitespace-nowrap rounded-full px-2.5 py-1 font-sans text-xs font-bold',
                    // Ở mốc đầu thì nhãn mọc sang phải, kẻo bị cắt ở mép màn hình hẹp
                    i === 0 && 'left-[-6px]',
                  )}
                  style={{
                    background: activeIndex >= 0 ? 'var(--amber)' : 'var(--navy)',
                    color: activeIndex >= 0 ? '#3B2400' : '#fff',
                    boxShadow: '0 6px 16px rgba(11,61,92,0.18)',
                  }}
                >
                  {activeIndex >= 0 ? 'Bạn ở đây' : 'Bạn đang ở đâu?'}
                </motion.span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ── Các chặng ── */}
      <ol className="relative grid gap-0 pl-11 lg:grid-cols-3 lg:gap-6 lg:pl-0 lg:pt-6">
        {/* Đường lộ trình dọc (điện thoại) */}
        <span aria-hidden="true" className="absolute bottom-10 left-[14px] top-3 w-1.5 rounded-full lg:hidden" style={{ background: 'rgba(11,61,92,0.10)' }} />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-10 left-[14px] top-3 w-1.5 origin-top rounded-full lg:hidden"
          style={{ background: 'linear-gradient(180deg, var(--teal-light), var(--teal) 55%, var(--amber))' }}
          initial={{ scaleY: reduce ? 1 : 0 }}
          animate={{ scaleY: shown ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DRAW * 1.3, ease: EASE, delay: 0.15 }}
        />

        {courses.map((c, i) => (
          <Station
            key={c.id}
            course={c}
            index={i}
            isActive={active === c.id}
            dimmed={active !== null && active !== c.id}
            wide={wide}
            reduce={reduce}
            onToggle={() => toggle(c.id)}
            formUrl={formUrl}
          />
        ))}

        {/* Đích (điện thoại) */}
        <li className="relative pb-2 lg:hidden" aria-hidden="true">
          <span
            className="absolute -left-[43px] top-0 flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'var(--amber)', boxShadow: '0 4px 14px rgba(239,159,39,0.4)' }}
          >
            <FlagIcon />
          </span>
          <p className="pt-1 font-sans text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            Mục tiêu <span className="font-mono text-lg font-bold" style={{ color: 'var(--amber)' }}>7.0+</span>
          </p>
        </li>
      </ol>

      {/* ── Chi tiết chặng đang chọn (máy tính) ── */}
      <div ref={desktopPanelRef} id="lo-trinh-chi-tiet" className="hidden scroll-mt-24 lg:block">
        <AnimatePresence mode="wait" initial={false}>
          {activeCourse ? (
            <motion.div
              key={activeCourse.id}
              className="mt-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
            >
              <CoursePanel course={activeCourse} index={activeIndex} formUrl={formUrl} />
            </motion.div>
          ) : (
            <motion.p
              key="goi-y"
              className="mt-6 text-center font-sans text-sm"
              style={{ color: 'var(--ink)', opacity: 0.6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
            >
              Bấm vào chặng giống bạn nhất để xem học gì, học bao lâu và học phí.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Một chặng ───────────────────────────────────────────────────────────── */

function Station({
  course,
  index,
  isActive,
  dimmed,
  wide,
  reduce,
  onToggle,
  formUrl,
}: {
  course: Course;
  index: number;
  isActive: boolean;
  dimmed: boolean;
  wide: boolean;
  reduce: boolean;
  onToggle: () => void;
  formUrl: string;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const shown = inView || reduce;
  const appear = reduce ? 0 : wide ? 0.35 + index * 0.32 : 0.05;

  return (
    <li ref={ref} id={`chang-${course.id}`} className="relative scroll-mt-24 pb-12 lg:pb-0">
      {/* Mốc band trên đường dọc (điện thoại) */}
      <span
        aria-hidden="true"
        className="absolute -left-[41px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold lg:hidden"
        style={{
          background: isActive ? 'var(--amber)' : '#fff',
          border: `3px solid ${isActive ? 'var(--amber)' : 'var(--teal)'}`,
          color: isActive ? '#3B2400' : 'var(--navy)',
          boxShadow: '0 2px 10px rgba(11,61,92,0.16)',
        }}
      >
        {index + 1}
      </span>

      <motion.div
        className="lg:h-full"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
        animate={shown ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: appear }}
      >
      <div
        className={cn(
          'group relative -mx-3 flex flex-col rounded-3xl p-3 transition-opacity duration-300 lg:mx-0 lg:h-full lg:p-5',
          dimmed && 'lg:opacity-60 lg:hover:opacity-100',
        )}
        style={
          isActive
            ? { background: '#fff', boxShadow: '0 10px 32px rgba(11,61,92,0.10)', outline: '2px solid var(--amber)', outlineOffset: '-2px' }
            : undefined
        }
      >
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--amber)' }}>
          {course.from === '0' ? <span className="font-sans">Mất gốc</span> : course.from} → {course.to}
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold leading-snug" style={{ color: 'var(--navy)' }}>
          {course.name}
        </h3>
        <p className="mt-1 font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.72 }}>
          {course.tagline}
        </p>

        <p className="mt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--teal)' }}>
          Nghe có giống bạn không?
        </p>
        <ul className="mt-2.5 flex flex-1 flex-col gap-2">
          {course.signs.map((s, k) => (
            <motion.li
              key={s}
              className="flex items-start gap-2.5 rounded-2xl rounded-tl-md px-3.5 py-2.5 font-sans text-sm leading-snug"
              style={{
                background: isActive ? 'rgba(239,159,39,0.10)' : '#fff',
                border: `1px solid ${isActive ? 'rgba(239,159,39,0.45)' : 'var(--mint)'}`,
                color: 'var(--ink)',
                boxShadow: '0 1px 6px rgba(11,61,92,0.05)',
              }}
              initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -6 }}
              animate={shown ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE, delay: appear + 0.18 + k * 0.06 }}
            >
              <span
                aria-hidden="true"
                className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: isActive ? 'var(--amber)' : 'var(--mint)', color: isActive ? '#3B2400' : 'var(--teal)' }}
              >
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span>&ldquo;{s}&rdquo;</span>
            </motion.li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isActive}
          aria-controls={`chi-tiet-${course.id} lo-trinh-chi-tiet`}
          className={cn(
            'mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-full px-5 font-sans text-sm font-semibold',
            'transition-transform duration-150 ease-out active:scale-[0.97]',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45',
            // Cả khối chặng bấm được: lớp phủ trong suốt kéo vùng bấm của nút ra toàn khối
            'after:absolute after:inset-0 after:rounded-3xl after:content-[""]',
          )}
          style={
            isActive
              ? { background: 'var(--amber)', color: '#3B2400' }
              : { background: 'var(--teal)', color: '#fff', boxShadow: '0 6px 18px rgba(29,158,117,0.28)' }
          }
        >
          {isActive ? 'Đang xem chặng này' : 'Đúng mình rồi, xem lộ trình'}
          <svg
            aria-hidden="true"
            className={cn('h-4 w-4 transition-transform duration-200', isActive && 'rotate-180 lg:rotate-0')}
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
      </div>
      </motion.div>

      {/* Chi tiết ngay dưới chặng (điện thoại) */}
      <div id={`chi-tiet-${course.id}`} className="lg:hidden">
        <AnimatePresence initial={false}>
          {isActive ? (
            <motion.div
              key="panel"
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            >
              <CoursePanel course={course} index={index} formUrl={formUrl} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </li>
  );
}

/* ── Chi tiết một khoá ───────────────────────────────────────────────────── */

function CoursePanel({ course, index, formUrl }: { course: Course; index: number; formUrl: string }) {
  return (
    <div
      className="grid grid-cols-1 gap-8 rounded-3xl bg-white p-4 sm:p-8 lg:grid-cols-[1.55fr_1fr] lg:gap-12"
      style={{ boxShadow: '0 12px 40px rgba(11,61,92,0.10)', border: '1px solid var(--mint)' }}
    >
      <div className="min-w-0">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--teal)' }}>
          Chặng {index + 1} · {course.from === '0' ? 'Mất gốc' : course.from} → {course.to}
        </p>
        <h3 className="mt-1 font-serif text-3xl font-bold" style={{ color: 'var(--navy)' }}>
          {course.name}
        </h3>
        <p className="mt-3 max-w-[62ch] font-sans text-[15px] leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.82 }}>
          {course.forWho}
        </p>

        <h4 className="mt-8 font-sans text-sm font-bold" style={{ color: 'var(--navy)' }}>
          Học gì
        </h4>
        <ol className="relative mt-3 space-y-4 border-l-2 pl-5" style={{ borderColor: 'var(--mint)' }}>
          {course.phases.map((p) => (
            <li key={p.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[27px] top-1 h-3 w-3 rounded-full"
                style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px #fff' }}
              />
              <p className="font-sans text-sm font-semibold" style={{ color: 'var(--navy)' }}>
                {p.title}
                {p.meta ? (
                  <span className="ml-2 font-mono text-xs font-medium" style={{ color: 'var(--teal)' }}>
                    {p.meta}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 max-w-[62ch] font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.78 }}>
                {p.body}
              </p>
            </li>
          ))}
        </ol>

        <h4 className="mt-8 font-sans text-sm font-bold" style={{ color: 'var(--navy)' }}>
          Học xong
        </h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {course.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 font-sans text-sm leading-snug" style={{ color: 'var(--ink)' }}>
              <svg aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {o}
            </li>
          ))}
        </ul>
        {course.next ? (
          <p className="mt-4 font-sans text-sm font-semibold" style={{ color: 'var(--teal)' }}>
            → {course.next}
          </p>
        ) : null}
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        <dl className="divide-y" style={{ borderColor: 'var(--mint)' }}>
          {course.facts.map((f) => (
            <div key={f.label} className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderColor: 'var(--mint)' }}>
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

        <a
          href={course.brochure}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-md font-sans text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D9E75]/45"
          style={{ color: 'var(--teal)' }}
        >
          Xem brochure đầy đủ
          <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 7h10v10M7 17 17 7" />
          </svg>
        </a>
      </aside>
    </div>
  );
}

function FlagIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="#3B2400" aria-hidden="true">
      <path d="M5 21V4h11l-1.5 4L16 12H7v9H5Z" />
    </svg>
  );
}
