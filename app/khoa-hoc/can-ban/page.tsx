// Brochure khoá IELTS Căn Bản 4.0-5.0 — thay brochure Canva canva.link/s6rchv6njq5zqzi.
// Bản 2 (Long 16/11/2026): theo thuyết noticing, ít chữ, chỉ tô cam đúng thông tin chính (nét bút dạ quang quét khi cuộn tới).
// Kiểu "cuốn tài liệu in" chia chương, màu LongIELTS Vox. Điểm nhấn: phiếu điểm IELTS 8.5 tự đóng dấu (score-sheet.tsx + motion.tsx).
// Nội dung ở lib/brochure-can-ban.ts (chung với bản in /khoa-hoc/can-ban/in → PDF ở public/brochure/).
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './brochure.css'
import { bvp, lora } from '@/lib/brochure-fonts'
import {
  ADDRESS,
  BROCHURE_FORM_URL,
  BROCHURE_PDF,
  UPDATED,
  ZALO_DISPLAY,
  ZALO_URL,
  forWho,
  founder,
  hero,
  lan,
  pricing,
  sessions,
  splitMarks,
  teachers,
  teachersNote,
  usps,
} from '@/lib/brochure-can-ban'
import { testimonialVideos } from '@/lib/testimonial-videos'
import { ScoreSheet } from './score-sheet'
import { BrochureMotion } from './motion'
import { DayArt, ReportCard, TeacherCard, TestTiles, Timeline } from './parts'

export const metadata: Metadata = {
  // Ảnh xem trước khi gửi link Zalo/Facebook = opengraph-image.png cùng thư mục; cần địa chỉ gốc để ra link tuyệt đối.
  metadataBase: new URL('https://test.longielts.website'),
  alternates: { canonical: '/khoa-hoc/can-ban' },
  title: 'IELTS Căn Bản 4.0-5.0 · Brochure khoá học · LongIELTS',
  description: hero.sub + ' Khoảng 6 tháng, 49 buổi, học thử 2 buổi miễn phí.',
  openGraph: {
    title: 'Brochure khoá IELTS Căn Bản 4.0-5.0 · LongIELTS',
    description: 'Lớp 10, 11 còn 1-2 năm chuẩn bị IELTS. Học khoảng 6 tháng, mỗi unit 3 buổi, học thử 2 buổi miễn phí.',
    type: 'website',
    locale: 'vi_VN',
  },
}

const LAN_SRC = testimonialVideos.find((v) => v.id === 'ngoc-lan')?.src ?? ''

/** Câu có [[cụm tô]]: cụm tô là nét bút dạ quang quét qua khi cuộn tới (thuyết noticing). */
function Marked({ text }: { text: string }) {
  return (
    <>
      {splitMarks(text).map((p, i) =>
        p.mark ? (
          <mark key={i} className="nb" data-mark>
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  )
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="ico" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="ico" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  )
}

function Title({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 className="ch-title" id={id} data-in>
      {children}
    </h2>
  )
}

export default function BrochureCanBanPage() {
  return (
    <main className={`bro ${bvp.variable} ${lora.variable}`} lang="vi">
      <BrochureMotion />

      <aside className="folio" data-folio aria-hidden="true">
        <span className="folio-label">Chương</span>
        <span className="folio-num" data-folio-num />
        <span className="folio-title" data-folio-title />
      </aside>

      {/* ── BÌA ── */}
      <section className="hero" aria-labelledby="bro-title">
        <div className="hero-ground ground-paper" data-depth="-0.12" aria-hidden="true" />
        <div className="hero-numeral" data-depth="-0.32" aria-hidden="true">
          5.0
        </div>

        <Link href="/" className="wordmark">
          <span className="wordmark-box">LongIELTS</span>
          <span className="wordmark-sub">Bảo Lộc</span>
        </Link>

        <div className="hero-body">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="bro-title" className="h1">
            <span className="h1-box">{hero.title}</span>
            <span className="h1-band">
              {hero.from} <span aria-hidden="true">→</span>
              <span className="sr-only">đến</span> {hero.to}
            </span>
          </h1>
          <p className="hero-sub">{hero.sub}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={BROCHURE_FORM_URL} target="_blank" rel="noopener noreferrer">
              Đăng ký học thử
            </a>
            <a className="btn-link" href={BROCHURE_PDF} download>
              <DownloadIcon />
              Tải bản PDF
            </a>
          </div>
        </div>

        <div className="hero-sheet-wrap" data-depth="0.22" aria-hidden="true">
          <div className="hero-sheet">
            <span className="tape tape--hero" />
            <div className="trf-top">
              <span className="trf-logo">IELTS</span>
              <span className="trf-kind">Kết quả · Academic</span>
            </div>
            <div className="hero-sheet-lines">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-sheet-score">
              Overall <b>8.5</b>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. DÀNH CHO AI: hai câu, ba cụm tô, một đường thời gian làm bằng chứng ── */}
      <section className="ch ground-sheet ch--quiet-end" data-chapter={forWho.title} data-num="1" aria-labelledby="c1">
        <div className="wrap">
          <Title id="c1">{forWho.title}</Title>
          <p className="big-line" data-in>
            <Marked text={forWho.line1} />
          </p>
          <p className="big-line big-line--2" data-in>
            <Marked text={forWho.line2} />
          </p>
          <Timeline t={forWho.timeline} />
        </div>
      </section>

      {/* ── 2. NGƯỜI DẠY (điểm nhấn) ── */}
      <section className="ch ground-navy ch--peak" data-chapter="Người dạy" data-num="2" aria-labelledby="c2">
        <div className="wrap">
          <Title id="c2">Người dạy</Title>
          <div className="peak">
            <div className="peak-stage" data-stamp-stage>
              <div className="peak-sticky">
                <ScoreSheet />
              </div>
            </div>
            <div className="peak-text">
              <p className="peak-name" data-in>
                {founder.name}
                <span>{founder.role}</span>
              </p>
              <ul className="creds" data-in>
                {founder.creds.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <figure className="photo photo--peak" data-in>
                <div className="photo-frame" data-drift="26">
                  <Image src="/students/class-photo-3.jpg" alt={founder.photoAlt} fill sizes="(min-width: 1024px) 480px, 92vw" className="photo-img" />
                </div>
                <figcaption>{founder.photoCaption}</figcaption>
              </figure>
            </div>
          </div>

          <div className="team">
            <h3 className="team-title" data-in>
              Đứng lớp cùng thầy
            </h3>
            <div className="team-grid">
              {teachers.map((t) => (
                <TeacherCard key={t.id} t={t} />
              ))}
            </div>
            <p className="team-note" data-in>
              {teachersNote}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. MỖI UNIT, 3 BUỔI ── */}
      <section className="ch ground-paper" data-chapter="Mỗi unit, 3 buổi" data-num="3" aria-labelledby="c3">
        <div className="wrap">
          <Title id="c3">Mỗi unit, 3 buổi</Title>
          <ol className="days">
            {sessions.map((s) => (
              <li key={s.n} className={`day day--${s.n}`} data-in>
                <div className="day-text">
                  <p className="day-n">Buổi {s.n}</p>
                  <h3 className="day-title">
                    <mark className="nb" data-mark>
                      {s.title}
                    </mark>
                    {s.isNew ? <span className="tag-new">Mới: {s.isNew}</span> : null}
                  </h3>
                  {s.sub ? <p className="day-sub">{s.sub}</p> : null}
                </div>
                <DayArt n={s.n} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. BA ĐIỀU PHỤ HUYNH YÊN TÂM ── */}
      <section className="ch ground-sheet" data-chapter={usps.title} data-num="4" aria-labelledby="c4">
        <div className="wrap">
          <Title id="c4">{usps.title}</Title>
          <div className="usp-grid">
            <article className="usp usp--test" data-in>
              <div className="usp-text">
                <h3>
                  <mark className="nb" data-mark>
                    {usps.test.title}
                  </mark>
                </h3>
                <p>{usps.test.text}</p>
              </div>
              <TestTiles />
            </article>

            <article className="usp usp--web" data-in>
              <div className="usp-text">
                <h3>
                  <mark className="nb" data-mark>
                    {usps.web.title}
                  </mark>
                </h3>
                <p>{usps.web.text}</p>
              </div>
              <div className="phone">
                <video
                  className="phone-video"
                  data-autoplay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/media/trang-hoc-poster.jpg"
                  aria-label="Video ngắn: trang học trên web, thầy sửa bài viết, bài nói tự thành chữ, nộp xong biết câu sai"
                >
                  <source src="/media/trang-hoc.mp4" type="video/mp4" />
                </video>
              </div>
            </article>

            <article className="usp usp--report" data-in>
              <div className="usp-text">
                <h3>
                  <mark className="nb" data-mark>
                    {usps.report.title}
                  </mark>
                </h3>
                <p>{usps.report.text}</p>
              </div>
              <ReportCard rows={usps.report.rows} />
            </article>
          </div>
        </div>
      </section>

      {/* ── 5. HỌC VIÊN NÓI GÌ: chỉ video Ngọc Lan ── */}
      <section className="ch ground-navy ch--lan" data-chapter={lan.title} data-num="5" aria-labelledby="c5">
        <div className="wrap lan">
          <Title id="c5">{lan.title}</Title>
          <figure className="lan-video" data-in>
            <video controls playsInline preload="none" poster={lan.poster} className="lan-player">
              <source src={LAN_SRC} type="video/mp4" />
            </video>
            <figcaption>
              {lan.caption} <span>({lan.duration})</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── KẾT: HỌC PHÍ ── */}
      <section className="ch ground-paper ch--close" data-chapter="Học phí" data-num="6" aria-labelledby="c6">
        <div className="wrap">
          <Title id="c6">Học phí</Title>
          <div className="close">
            <div className="price-card" data-in>
              <p className="price-basis">{pricing.basis}</p>
              <table className="price">
                <caption className="sr-only">Học phí khoá IELTS Căn Bản</caption>
                <tbody>
                  {pricing.plans.map((p) => (
                    <tr key={p.k} className={p.best ? 'is-best' : undefined}>
                      <th scope="row">
                        {p.k}
                        {p.save ? <small>{p.save}</small> : null}
                        {p.best ? <em>Tiết kiệm nhất</em> : null}
                      </th>
                      <td>{p.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="price-material">{pricing.material}</p>
            </div>
            <div className="close-side" data-in>
              <p className="trial">
                <mark className="nb" data-mark>
                  {pricing.trial}
                </mark>
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href={BROCHURE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Đăng ký học thử
                </a>
                <a className="btn btn-ghost" href={ZALO_URL} target="_blank" rel="noopener noreferrer">
                  <ChatIcon />
                  Zalo {ZALO_DISPLAY}
                </a>
              </div>
              <p className="address">Lớp học: {ADDRESS}</p>
            </div>
          </div>

          <footer className="colophon">
            <p>
              LongIELTS · {ADDRESS} · Zalo {ZALO_DISPLAY} · Cập nhật {UPDATED}
            </p>
            <p>
              <a href={BROCHURE_PDF} download>
                Tải bản PDF
              </a>
              <span aria-hidden="true"> · </span>
              <Link href="/">Về trang chủ LongIELTS</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}
