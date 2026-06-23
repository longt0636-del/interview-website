import Link from 'next/link'
import { HeroAurora } from '@/components/ui/hero-aurora'
import { TestimonialsSection } from '@/components/ui/testimonials-section'
import { ButtonColorful } from '@/components/ui/button-colorful'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/1sZbzR4G_j-YYpKKBcQ5bNwHhfQEH9a0k9GaJW4FCtjk/viewform'

const courses = [
  {
    tag: 'IELTS NỀN TẢNG — Band 3–4',
    icon: '🌱',
    name: 'Bắt đầu đúng cách, nền tảng vững chắc.',
    desc: 'Dành cho học viên mất gốc hoặc cơ bản. Xây dựng lại Grammar, Vocabulary và 4 kỹ năng từ đầu.',
    link: 'https://canva.link/d55b4f4fjkcghlc',
    from: '0',
    target: '4.0+',
    tagline: 'Xây nền tảng vững chắc • Nâng band vượt bậc',
    stats: [
      { value: '<8',  label: 'HV/lớp' },
      { value: '2x',  label: 'Buổi/tuần' },
      { value: '10T', label: 'Lộ trình' },
    ],
  },
  {
    tag: 'IELTS CĂN BẢN — Band 4–5',
    icon: '📈',
    name: 'Nền tảng vững, band score không lo.',
    desc: 'Dành cho học viên đã có căn bản, cần hệ thống hóa kiến thức và chiến lược làm bài chuẩn IELTS.',
    link: 'https://canva.link/s6rchv6njq5zqzi',
    from: '4.0',
    target: '5.0+',
    tagline: 'Hệ thống kiến thức • Chiến lược làm bài hiệu quả',
    stats: [
      { value: '<8',  label: 'HV/lớp' },
      { value: '2x',  label: 'Buổi/tuần' },
      { value: '10T', label: 'Lộ trình' },
    ],
  },
  {
    tag: 'ROAD TO IELTS — Band 5–6+',
    icon: '🎯',
    name: 'Từ 5.0 lên 7.0 — chiến lược thực chiến.',
    desc: 'Dành cho học viên Band 5.0+, cần chiến lược làm bài chuyên sâu và luyện đề thi thật.',
    link: 'https://canva.link/iqi67oe336pt5h0',
    from: '5.0',
    target: '7.0+',
    tagline: 'Chiến lược chuyên sâu • Luyện đề sát thực tế',
    stats: [
      { value: '<8',  label: 'HV/lớp' },
      { value: '3x',  label: 'Buổi/tuần' },
      { value: '8T',  label: 'Lộ trình' },
    ],
  },
]

const steps = [
  {
    num: '01',
    title: 'Điền form khảo sát',
    desc: 'Chia sẻ mục tiêu, deadline và trình độ hiện tại. Chỉ mất 5 phút.',
    action: { label: 'Điền form ngay ↗', href: GOOGLE_FORM_URL, external: true },
  },
  {
    num: '02',
    title: 'Làm bài kiểm tra trình độ',
    desc: 'Hệ thống tự giao bài test phù hợp. Làm theo tốc độ của bạn, nộp khi sẵn sàng.',
    action: { label: 'Nhận bài test →', href: '/get-test', external: false },
  },
  {
    num: '03',
    title: 'Nhận lịch học thử',
    desc: 'Thầy Long liên hệ trong 24h để phân tích kết quả và sắp xếp 2 buổi học thử miễn phí.',
    action: null,
  },
]

const faqs = [
  {
    q: 'Học thử có mất phí không?',
    a: '2 buổi học thử hoàn toàn miễn phí. Thầy muốn bạn trải nghiệm thực sự trước khi quyết định.',
  },
  {
    q: 'Một lớp có bao nhiêu học sinh?',
    a: 'Tối đa 8 học sinh. Thầy biết tên, biết điểm yếu từng em để cá nhân hóa phương pháp.',
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
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif font-bold text-xl" style={{ color: 'var(--navy)' }}>
            Long<span style={{ color: 'var(--teal)' }}>IELTS</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-sans" style={{ color: 'var(--ink)' }}>
            <a href="#courses" className="hover:opacity-70 transition-opacity">Khóa học</a>
            <a href="#how" className="hover:opacity-70 transition-opacity">Quy trình</a>
            <a href="#faq" className="hover:opacity-70 transition-opacity">FAQ</a>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm font-semibold px-5 py-2 rounded-full transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Đăng ký ngay ↗
          </a>
        </div>
      </nav>

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
              <div className="flex flex-wrap gap-4 items-center mb-14">
                <ButtonColorful
                  label="Bước 1: Điền form khảo sát"
                  href={GOOGLE_FORM_URL}
                  external
                />
                <Link
                  href="/get-test"
                  className="font-sans font-semibold px-8 py-4 rounded-xl border transition-opacity hover:opacity-80 text-base"
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Bước 2: Nhận bài test →
                </Link>
              </div>
              {/* Score badge */}
              <div className="flex items-end gap-4">
                <div
                  className="font-mono font-bold leading-none"
                  style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', color: 'var(--amber)' }}
                >
                  8.5
                </div>
                <div className="pb-3">
                  <div className="font-sans font-bold text-base text-white">IELTS Overall</div>
                  <div className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Thầy Long · Giáo viên của bạn
                  </div>
                </div>
              </div>
            </div>

            {/* Right — student photo */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                {/* Decorative glow ring */}
                <div
                  className="absolute -inset-3 rounded-3xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--teal) 0%, rgba(93,202,165,0.3) 100%)',
                    filter: 'blur(20px)',
                    opacity: 0.35,
                  }}
                />
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    border: '2px solid rgba(93,202,165,0.45)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                    maxWidth: 420,
                  }}
                >
                  <img
                    src="/students/lan-result.jpg"
                    alt="Thầy Long cùng Trương Ngọc Lan đạt IELTS 7.5"
                    className="w-full h-auto object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" style={{ background: 'var(--off-white)' }} className="py-24 px-6 relative overflow-hidden">
        <GridPattern
          width={32} height={32}
          strokeDasharray="4 2"
          className={cn('fill-[#1D9E75]/[0.03] stroke-[#1D9E75]/[0.06]', '[mask-image:radial-gradient(800px_circle_at_50%_20%,white,transparent)]')}
        />
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header with decorative icons */}
          <div className="relative text-center mb-14">
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(29,158,117,0.3))' }}>
              🎓
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(29,158,117,0.3))' }}>
              📖
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
              <p className="font-sans text-xs font-semibold uppercase tracking-widest"
                 style={{ color: 'var(--teal)' }}>
                · Khóa học ·
              </p>
              <span className="w-8 h-px" style={{ background: 'var(--teal)' }} />
            </div>
            <h2 className="font-serif font-bold text-4xl mb-4" style={{ color: 'var(--navy)' }}>
              3 cấp độ phù hợp mọi học viên
            </h2>
            <p className="font-sans max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.7 }}>
              Hệ thống tự xếp bạn vào đúng lớp sau bài kiểm tra.<br />
              Bấm vào từng khóa để xem chi tiết lộ trình.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white rounded-2xl hover:-translate-y-1 overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(11,61,92,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                {/* Top teal border */}
                <div className="h-1.5" style={{ background: 'var(--teal)' }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Tag */}
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                     style={{ color: 'var(--teal)' }}>
                    {c.tag}
                  </p>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: 'var(--mint)' }}
                    >
                      {c.icon}
                    </div>
                    <h3 className="font-serif font-bold text-xl leading-snug"
                        style={{ color: 'var(--navy)' }}>
                      {c.name}
                    </h3>
                  </div>

                  <p className="font-sans text-sm leading-relaxed mb-5 flex-1"
                     style={{ color: 'var(--ink)', opacity: 0.75 }}>
                    {c.desc}
                  </p>

                  {/* Target band block — from → to */}
                  <div
                    className="rounded-xl px-4 pt-3 pb-2.5 mb-4"
                    style={{ background: 'var(--navy)' }}
                  >
                    <div className="font-sans text-xs font-semibold uppercase tracking-wider mb-3"
                         style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Mục tiêu band
                    </div>
                    <div className="flex items-center gap-2 mb-2.5">
                      {/* From badge */}
                      <div
                        className="font-mono font-bold text-base w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {c.from}
                      </div>
                      {/* Dashed arrow */}
                      <div className="flex-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.25)' }} />
                        ))}
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ opacity: 0.7 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      {/* Target */}
                      <div className="font-mono font-bold text-2xl shrink-0" style={{ color: 'var(--amber)' }}>
                        {c.target}
                      </div>
                      {/* Target icon */}
                      <div className="shrink-0 text-xl opacity-30 ml-1">🎯</div>
                    </div>
                    <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {c.tagline}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t" style={{ borderColor: 'var(--mint)' }}>
                    {c.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="font-mono font-bold text-base" style={{ color: 'var(--navy)' }}>
                          {s.value}
                        </div>
                        <div className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink)', opacity: 0.55 }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold font-sans"
                       style={{ color: 'var(--teal)' }}>
                    Xem chi tiết lộ trình
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--mint)' }}>
        <GridPattern
          width={36} height={36}
          className={cn('fill-[#0B3D5C]/[0.04] stroke-[#0B3D5C]/[0.07]', '[mask-image:linear-gradient(to_bottom,white,transparent)]')}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
               style={{ color: 'var(--teal)' }}>
              Quy trình
            </p>
            <h2 className="font-serif font-bold text-4xl" style={{ color: 'var(--navy)' }}>
              Bắt đầu trong 3 bước
            </h2>
          </div>

          {/* Photos + Steps layout */}
          <div className="relative">

            {/* Left photo — spans steps 01 and 03 */}
            <div className="hidden lg:block absolute left-[12px] top-0 w-56 pointer-events-none" style={{ zIndex: 0 }}>
              <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(29,158,117,0.22)', boxShadow: '0 8px 32px rgba(11,61,92,0.13)' }}>
                <img src="/students/long-outdoor.jpg" alt="Thầy Long" className="w-full object-cover" style={{ aspectRatio: '2/3', objectPosition: 'center' }} />
              </div>
              {/* Dot: step 01 level */}
              <div className="absolute" style={{ right: '-6px', top: '46px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--mint)' }} />
              {/* Dot: step 03 level */}
              <div className="absolute" style={{ right: '-6px', top: '258px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--mint)' }} />
            </div>

            {/* Right photo — aligned with step 02 */}
            <div className="hidden lg:block absolute right-[12px] w-56 pointer-events-none" style={{ top: '108px', zIndex: 0 }}>
              <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(29,158,117,0.22)', boxShadow: '0 8px 32px rgba(11,61,92,0.13)' }}>
                <img src="/students/long-forest.jpg" alt="Thầy Long" className="w-full object-cover" style={{ aspectRatio: '2/3', objectPosition: 'center' }} />
              </div>
              {/* Dot: step 02 level */}
              <div className="absolute" style={{ left: '-6px', top: '46px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--mint)' }} />
            </div>

            {/* Steps — centered with horizontal room for photos */}
            <div className="lg:mx-[248px] space-y-4 relative z-10">
              {steps.map((s, idx) => (
                <div key={s.num} className="relative">

                  {/* Dashed connecting line — steps 01 and 03 go LEFT */}
                  {(idx === 0 || idx === 2) && (
                    <div className="hidden lg:block absolute pointer-events-none" style={{ right: '100%', top: '50%', width: '40px', marginTop: '-1px', borderTop: '1.5px dashed #5DCAA5' }} />
                  )}
                  {/* Dashed connecting line — step 02 goes RIGHT with arrow */}
                  {idx === 1 && (
                    <div className="hidden lg:block absolute pointer-events-none" style={{ left: '100%', top: '50%', width: '40px', marginTop: '-1px', borderTop: '1.5px dashed #5DCAA5' }}>
                      <svg style={{ position: 'absolute', right: '-2px', top: '-5px' }} width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M1 1l5 4-5 4" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-6 flex gap-5 items-center" style={{ boxShadow: '0 2px 12px rgba(11,61,92,0.08)' }}>
                    {/* Step number */}
                    <div className="font-mono font-bold text-3xl shrink-0 w-14 text-center" style={{ color: 'var(--amber)' }}>
                      {s.num}
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-sans font-bold text-lg mb-1" style={{ color: 'var(--navy)' }}>{s.title}</h3>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.75 }}>{s.desc}</p>
                    </div>
                    {/* Action */}
                    {s.action && (
                      <ButtonColorful
                        label={s.action.label}
                        href={s.action.href}
                        external={s.action.external}
                        className="shrink-0"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

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
      <section id="faq" className="py-24 px-6 bg-white relative overflow-hidden">
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
          <div className="flex flex-wrap gap-4 justify-center">
            <ButtonColorful
              label="Điền form khảo sát"
              href={GOOGLE_FORM_URL}
              external
            />
            <Link
              href="/get-test"
              className="font-sans font-semibold px-8 py-4 rounded-xl border text-base hover:opacity-80 transition-opacity"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Đã điền form → Nhận bài test
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
