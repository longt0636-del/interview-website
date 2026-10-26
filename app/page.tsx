import Link from 'next/link'
import { HeroAurora } from '@/components/ui/hero-aurora'
import { HeroSpotlight } from '@/components/ui/hero-spotlight'
import { SiteNav } from '@/components/ui/site-nav'
import { TestimonialsSection } from '@/components/ui/testimonials-section'
import { GridPattern } from '@/components/ui/grid-pattern'
import { StepOneCta } from '@/components/ui/step-one-cta'
import { CourseRoadmap } from '@/components/ui/course-roadmap'
import { LearningSiteShowcase } from '@/components/ui/learning-site-showcase'
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  MapPinIcon,
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/1sZbzR4G_j-YYpKKBcQ5bNwHhfQEH9a0k9GaJW4FCtjk/viewform'

const faqs = [
  {
    q: 'Học thử có mất phí không?',
    a: '2 buổi học thử hoàn toàn miễn phí. Thầy muốn bạn trải nghiệm thực sự trước khi quyết định.',
  },
  {
    q: 'Một lớp có bao nhiêu học sinh?',
    a: 'Tối đa 10 học sinh. Thầy biết tên, biết điểm yếu từng em để cá nhân hóa phương pháp.',
  },
  {
    q: 'Chưa biết trình độ của mình ở đâu thì sao?',
    a: 'Bài kiểm tra trình độ miễn phí sau khi điền form sẽ xác định chính xác bạn đang ở đâu và phù hợp với khóa nào.',
  },
  {
    q: 'Thầy có đảm bảo học viên đạt band mục tiêu không?',
    a: 'Thầy không hứa một con số cụ thể — vì kết quả phụ thuộc nhiều vào nỗ lực và hoàn cảnh của từng bạn. Nhưng thầy cam kết làm hết sức mình: theo dõi tiến độ từng buổi, điều chỉnh phương pháp kịp thời, và đồng hành cùng bạn đến khi đạt được điểm số xứng đáng.',
  },
]

export default function HomePage() {
  return (
    <main className="flex flex-col">

      {/* ── NAV ── */}
      <SiteNav formUrl={GOOGLE_FORM_URL} />

      {/* ── HERO ── */}
      <section className="pt-16 min-h-screen flex items-center px-6 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
        <HeroAurora />
        <GridPattern
          width={40} height={40}
          squares={[[2,2],[6,4],[10,8],[14,3],[18,12],[3,14],[8,18],[16,6]]}
          className={cn('fill-white/[0.02] stroke-white/[0.04]', '[mask-image:radial-gradient(900px_circle_at_60%_50%,white,transparent)]')}
        />
        <div className="max-w-6xl mx-auto w-full py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                 style={{ color: 'var(--teal-light)' }}>
                HỌC ĐÚNG · HỌC ĐỦ · THI THẬT
              </p>
              <h1 className="font-serif font-bold text-white leading-tight mb-6"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                Lớp IELTS chất lượng cao.<br />
                Lộ trình{' '}
                <span style={{ color: 'var(--teal-light)' }}>cá nhân hóa.</span>
              </h1>
              <p className="font-sans text-lg leading-relaxed mb-10 max-w-xl"
                 style={{ color: 'rgba(255,255,255,0.75)' }}>
                100% học viên tăng ít nhất 0.5 band. Lớp kèm số lượng ít —
                không nhồi nhét học viên, bám sát năng lực học từng em.
              </p>
              {/* Class address — parents ask for this most often */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=289%2F26+H%E1%BB%93+T%C3%B9ng+M%E1%BA%ADu%2C+B%E1%BA%A3o+L%E1%BB%99c%2C+L%C3%A2m+%C4%90%E1%BB%93ng"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 mb-8 max-w-xl transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EF9F27]/60"
                style={{
                  background: 'rgba(239,159,39,0.12)',
                  border: '2px solid var(--amber)',
                  boxShadow: '0 8px 24px rgba(239,159,39,0.18)',
                }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ background: 'var(--amber)', color: 'var(--navy)' }}
                >
                  <MapPinIcon className="w-7 h-7" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-1"
                        style={{ color: 'var(--amber)' }}>
                    Địa chỉ lớp học
                  </span>
                  <span className="block font-sans font-bold text-white text-lg sm:text-xl leading-snug">
                    289/26 Hồ Tùng Mậu,{' '}<span className="whitespace-nowrap">Bảo Lộc</span>
                  </span>
                  <span className="block font-sans text-xs sm:text-sm mt-0.5 group-hover:underline"
                        style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Bấm để xem đường đi trên Google Maps
                  </span>
                </span>
              </a>
              {/* Bước 1 là nút chính (có hiệu ứng mời bấm); Bước 2 dành cho bạn đã điền form */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center mb-10">
                <StepOneCta href={GOOGLE_FORM_URL} className="w-full sm:w-auto" />
                <Link
                  href="/get-test"
                  className="font-sans font-semibold h-14 px-5 rounded-2xl text-[15px] inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#EF9F27]/60"
                  style={{
                    color: 'var(--amber)',
                    border: '2px solid rgba(239,159,39,0.75)',
                    background: 'rgba(239,159,39,0.08)',
                  }}
                >
                  Bước 2: Nhận bài test
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              {/* Teacher credential */}
              <div
                className="inline-flex items-end gap-4 rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(93,202,165,0.22)' }}
              >
                <div
                  className="font-mono font-bold leading-none"
                  style={{ fontSize: 'clamp(3.25rem, 8vw, 5rem)', color: 'var(--amber)' }}
                >
                  8.5
                </div>
                <div className="pb-1.5">
                  <div className="font-sans font-bold text-sm sm:text-base text-white">IELTS Overall</div>
                  <div className="font-sans text-xs sm:text-sm whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Thầy Long · Giáo viên của bạn
                  </div>
                </div>
              </div>
            </div>

            {/* Right — video spotlight (newest student result) */}
            <div className="flex items-center justify-center md:pl-4">
              <HeroSpotlight />
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" style={{ background: 'var(--off-white)' }} className="py-24 px-6 relative overflow-hidden scroll-mt-20">
        <GridPattern
          width={32} height={32}
          strokeDasharray="4 2"
          className={cn('fill-[#1D9E75]/[0.03] stroke-[#1D9E75]/[0.06]', '[mask-image:radial-gradient(800px_circle_at_50%_20%,white,transparent)]')}
        />
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header with decorative icons */}
          <div className="relative text-center mb-14">
            <AcademicCapIcon
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none"
              strokeWidth={1.1}
              style={{ color: 'var(--teal)', opacity: 0.22 }}
            />
            <BookOpenIcon
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none"
              strokeWidth={1.1}
              style={{ color: 'var(--teal)', opacity: 0.22 }}
            />
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
              <p className="font-sans text-xs font-semibold uppercase tracking-widest"
                 style={{ color: 'var(--teal)' }}>
                · Khóa học ·
              </p>
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
            </div>
            <h2 className="font-serif font-bold text-4xl mb-4" style={{ color: 'var(--navy)' }}>
              Bạn đang ở chặng nào?
            </h2>
            <p className="font-sans max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.7 }}>
              Ba khoá nối nhau thành một con đường từ mất gốc tới 7.0+. Đọc thử mấy câu dưới đây,
              thấy câu nào giống mình thì bấm vào chặng đó để xem học gì, học bao lâu và học phí.
            </p>
          </div>

          <CourseRoadmap formUrl={GOOGLE_FORM_URL} />

          <p className="mt-10 text-center font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.7 }}>
            Chưa chắc mình ở chặng nào? Cứ điền form, bài kiểm tra trình độ sẽ xếp bạn vào đúng lớp.
          </p>
        </div>
      </section>

      {/* ── TRANG HỌC RIÊNG (thay mục Quy trình, 26/10/2026) ── */}
      <LearningSiteShowcase formUrl={GOOGLE_FORM_URL} />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── SCORE SOCIAL PROOF ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
        <GridPattern
          width={44} height={44}
          squares={[[3,3],[8,6],[14,2],[18,10],[6,14],[12,18]]}
          className={cn('fill-white/[0.02] stroke-white/[0.04]', '[mask-image:radial-gradient(700px_circle_at_50%_50%,white,transparent)]')}
        />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
              <p className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--teal-light)' }}>
                · Kết quả thực tế ·
              </p>
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
            </div>
            <h2 className="font-serif font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Điểm IELTS của Thầy Long
            </h2>
          </div>

          {/* Overall card */}
          <div
            className="rounded-3xl p-10 mb-4 flex flex-col items-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(29,158,117,0.12) 0%, rgba(11,61,92,0.6) 60%, rgba(255,255,255,0.04) 100%)',
              border: '1px solid rgba(93,202,165,0.28)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Concentric rings */}
            {[320, 240, 160].map((size) => (
              <div key={size} className="absolute rounded-full pointer-events-none" style={{
                width: size, height: size,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(93,202,165,0.07)',
              }} />
            ))}

            {/* OVERALL pill */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-8 relative z-10"
                 style={{ background: 'rgba(11,61,92,0.7)', border: '1px solid rgba(93,202,165,0.35)' }}>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--teal-light)' }}>
                Overall
              </span>
            </div>

            {/* 8.5 with glow */}
            <div className="relative mb-5 px-6">
              {/* Sparkles */}
              <span className="absolute font-sans font-bold text-lg select-none" style={{ top: '-4px', right: '-20px', color: '#FFD700', opacity: 0.85 }}>✦</span>
              <span className="absolute font-sans font-bold text-sm select-none" style={{ bottom: '12px', left: '-22px', color: '#EF9F27', opacity: 0.7 }}>✦</span>

              <div className="font-mono font-black relative z-10" style={{
                fontSize: 'clamp(8rem, 20vw, 12rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.05em',
                background: 'linear-gradient(180deg, #FFD700 0%, #EF9F27 55%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(239,159,39,0.55))',
              }}>
                8.5
              </div>
            </div>

            <p className="font-sans text-sm mb-5 relative z-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Thầy Long • Kết quả IELTS thực tế
            </p>

            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full relative z-10"
                 style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#5DCAA5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Kết quả thi IELTS Academic chính thức
              </span>
            </div>
          </div>

          {/* Skill bars */}
          <div className="rounded-3xl px-6 py-2"
               style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)', border: '1px solid rgba(93,202,165,0.18)' }}>
            {[
              { skill: 'Reading',   score: '9.0', pct: 100, barFrom: '#1D9E75', barTo: '#5DCAA5', scoreColor: '#5DCAA5',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
                iconBg: 'rgba(29,158,117,0.25)', iconStroke: '#5DCAA5' },
              { skill: 'Listening', score: '9.0', pct: 100, barFrom: '#3B82F6', barTo: '#67E8F9', scoreColor: '#67E8F9',
                icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></>,
                iconBg: 'rgba(59,130,246,0.25)', iconStroke: '#67E8F9' },
              { skill: 'Writing',   score: '7.5', pct: 83,  barFrom: '#D97706', barTo: '#FCD34D', scoreColor: '#EF9F27',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />,
                iconBg: 'rgba(217,119,6,0.25)', iconStroke: '#FCD34D' },
              { skill: 'Speaking',  score: '7.5', pct: 83,  barFrom: '#7C3AED', barTo: '#C4B5FD', scoreColor: '#C4B5FD',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />,
                iconBg: 'rgba(124,58,237,0.25)', iconStroke: '#C4B5FD' },
            ].map(({ skill, score, pct, barFrom, barTo, scoreColor, icon, iconBg, iconStroke }) => (
              <div key={skill} className="flex items-center gap-4 py-4 border-b last:border-b-0"
                   style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: iconBg, border: `1px solid ${iconStroke}40` }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke={iconStroke}>
                    {icon}
                  </svg>
                </div>
                <span className="font-sans font-semibold text-sm text-white w-20 shrink-0">{skill}</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barFrom}, ${barTo})` }} />
                </div>
                <span className="font-mono font-bold text-xl w-12 text-right shrink-0" style={{ color: scoreColor }}>
                  {score}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-white relative overflow-hidden scroll-mt-20">
        <GridPattern
          width={28} height={28}
          strokeDasharray="4 2"
          className={cn('fill-[#1D9E75]/[0.03] stroke-[#1D9E75]/[0.05]', '[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]')}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
               style={{ color: 'var(--teal)' }}>
              FAQ
            </p>
            <h2 className="font-serif font-bold text-4xl" style={{ color: 'var(--navy)' }}>
              Câu hỏi thường gặp
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl p-6 border"
                   style={{ borderColor: 'var(--mint)', background: 'var(--off-white)' }}>
                <h3 className="font-sans font-semibold mb-2" style={{ color: 'var(--navy)' }}>
                  {f.q}
                </h3>
                <p className="font-sans text-sm leading-relaxed"
                   style={{ color: 'var(--ink)', opacity: 0.75 }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
        <GridPattern
          width={40} height={40}
          squares={[[2,4],[6,2],[10,8],[4,12],[14,6],[18,14]]}
          className={cn('fill-white/[0.02] stroke-white/[0.05]', '[mask-image:radial-gradient(500px_circle_at_50%_60%,white,transparent)]')}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
             style={{ color: 'var(--teal-light)' }}>
            Bắt đầu hành trình
          </p>
          <h2 className="font-serif font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Sẵn sàng phá band IELTS chưa?
          </h2>
          <p className="font-sans mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Kiểm tra trình độ miễn phí. Không cần cam kết ngay.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-center justify-center">
            <StepOneCta href={GOOGLE_FORM_URL} />
            <Link
              href="/get-test"
              className="font-sans font-semibold h-14 px-6 rounded-2xl border text-base inline-flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5DCAA5]/50"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}
            >
              Đã điền form? Nhận bài test
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 border-t relative overflow-hidden" style={{ background: '#fff', borderColor: 'var(--mint)' }}>
        <GridPattern
          width={24} height={24}
          className={cn('fill-[#1D9E75]/[0.02] stroke-[#1D9E75]/[0.04]', '[mask-image:linear-gradient(to_right,white,transparent)]')}
        />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
          <span className="font-serif font-bold text-lg" style={{ color: 'var(--navy)' }}>
            Long<span style={{ color: 'var(--teal)' }}>IELTS</span>
          </span>
          <p className="font-sans text-xs" style={{ color: 'var(--ink)', opacity: 0.5 }}>
            HỌC ĐÚNG · HỌC ĐỦ · THI THẬT · Bảo Lộc, Lâm Đồng
          </p>
          <p className="font-sans text-xs" style={{ color: 'var(--ink)', opacity: 0.4 }}>
            © 2026 LongIELTS
          </p>
        </div>
      </footer>

    </main>
  )
}
