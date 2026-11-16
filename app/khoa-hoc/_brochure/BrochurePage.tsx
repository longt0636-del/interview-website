// Trang brochure dùng chung cho 3 khoá (Long 16/11/2026). Kiểu "cuốn tài liệu in" chia chương, màu LongIELTS Vox.
// Luật noticing: cam chỉ ở đúng cụm cần nhớ (nét bút dạ quang quét khi cuộn tới), mỗi ý có hình/chuyển động làm bằng chứng.
// Điểm nhấn: phiếu điểm IELTS 8.5 tự đóng dấu. Chương "Trang học riêng": bấm tính năng là video trang học tua đúng cảnh.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './brochure.css'
import { bvp, lora } from '@/lib/brochure-fonts'
import { ADDRESS, FORM_URL, SITE, UPDATED, ZALO_DISPLAY, ZALO_URL, splitMarks, type Brochure } from '@/lib/brochures/shared'
import { testimonialVideos } from '@/lib/testimonial-videos'
import { ScoreSheet } from './score-sheet'
import { BrochureMotion } from './motion'
import { DayArt, ReportCard, TeacherCard, TestTiles, Timeline, WEB_SCENES } from './parts'

export function brochureMetadata(b: Brochure): Metadata {
  return {
    // Ảnh xem trước khi gửi link Zalo/Facebook = opengraph-image.png trong thư mục từng khoá; cần địa chỉ gốc để ra link tuyệt đối.
    metadataBase: new URL(SITE),
    alternates: { canonical: b.path },
    title: b.metaTitle,
    description: b.metaDesc,
    openGraph: { title: b.ogTitle, description: b.ogDesc, type: 'website', locale: 'vi_VN' },
  }
}

/** Câu có [[cụm tô]]: cụm tô là nét bút dạ quang quét qua khi cuộn tới (thuyết noticing). */
export function Marked({ text, live = true }: { text: string; live?: boolean }) {
  return (
    <>
      {splitMarks(text).map((p, i) =>
        p.mark ? (
          <mark key={i} className="nb" data-mark={live ? '' : undefined}>
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

export function BrochurePage({ b }: { b: Brochure }) {
  const video = testimonialVideos.find((v) => v.id === b.video.id)
  let n = 0
  const next = () => String(++n)
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
          {b.hero.numeral}
        </div>
        <Link href="/" className="wordmark">
          <span className="wordmark-box">LongIELTS</span>
          <span className="wordmark-sub">Bảo Lộc</span>
        </Link>
        <div className="hero-body">
          <p className="eyebrow">{b.hero.eyebrow}</p>
          <h1 id="bro-title" className="h1">
            <span className="h1-box">{b.hero.title}</span>
            <span className="h1-band">
              {b.hero.from} <span aria-hidden="true">→</span>
              <span className="sr-only">đến</span> {b.hero.to}
            </span>
          </h1>
          <p className="hero-sub">{b.hero.sub}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={FORM_URL} target="_blank" rel="noopener noreferrer">
              Đăng ký học thử
            </a>
            <a className="btn-link" href={b.pdf} download>
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

      {/* ── DÀNH CHO AI ── */}
      <section className="ch ground-sheet ch--quiet-end" data-chapter={b.forWho.title} data-num={next()} aria-labelledby="c1">
        <div className="wrap">
          <Title id="c1">{b.forWho.title}</Title>
          <p className="big-line" data-in>
            <Marked text={b.forWho.line1} />
          </p>
          <p className="big-line big-line--2" data-in>
            <Marked text={b.forWho.line2} />
          </p>
          <Timeline t={b.forWho.timeline} />
        </div>
      </section>

      {/* ── NGƯỜI DẠY (điểm nhấn) ── */}
      <section className="ch ground-navy ch--peak" data-chapter="Người dạy" data-num={next()} aria-labelledby="c2">
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
                Thầy Trần Nhật Long
                <span>{b.founderRole}</span>
              </p>
              <ul className="creds" data-in>
                {b.founderCreds.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {b.founderPhoto ? (
                <figure className="photo photo--peak" data-in>
                  <div className="photo-frame" data-drift="26">
                    <Image src={b.founderPhoto.src} alt={b.founderPhoto.alt} fill sizes="(min-width: 1024px) 480px, 92vw" className="photo-img" />
                  </div>
                  <figcaption>{b.founderPhoto.caption}</figcaption>
                </figure>
              ) : null}
            </div>
          </div>
          {b.teachers.length ? (
            <div className="team">
              <h3 className="team-title" data-in>
                {b.teamTitle}
              </h3>
              <div className="team-grid">
                {b.teachers.map((t) => (
                  <TeacherCard key={t.id} t={t} />
                ))}
              </div>
              {b.teachersNote ? (
                <p className="team-note" data-in>
                  {b.teachersNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── MỖI UNIT / MỖI TUẦN HỌC GÌ ── */}
      <section className="ch ground-paper" data-chapter={b.sessionsTitle} data-num={next()} aria-labelledby="c3">
        <div className="wrap">
          <Title id="c3">{b.sessionsTitle}</Title>
          <ol className="days">
            {b.sessions.map((s, i) => (
              <li key={s.n} className={`day day--${(i % 3) + 1}`} data-in>
                <div className="day-text">
                  <p className="day-n">
                    {b.sessionLabel} {s.n}
                  </p>
                  <h3 className="day-title">
                    <mark className="nb" data-mark>
                      {s.title}
                    </mark>
                    {s.isNew ? <span className="tag-new">Mới: {s.isNew}</span> : null}
                  </h3>
                  {s.sub ? <p className="day-sub">{s.sub}</p> : null}
                </div>
                <DayArt arts={s.arts} text={b.artText} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── TRANG HỌC RIÊNG: bấm tính năng → video tua đúng cảnh ── */}
      <section className="ch ground-navy ch--web" data-chapter={b.web.title} data-num={next()} aria-labelledby="c4">
        <div className="wrap">
          <Title id="c4">{b.web.title}</Title>
          <p className="web-lead" data-in>
            <Marked text={b.web.lead} />
          </p>
          <div className="web" data-web>
            <div className="phone phone--web">
              <video
                className="phone-video"
                data-autoplay
                muted
                loop
                playsInline
                preload="none"
                poster="/media/trang-hoc-poster.jpg"
                aria-label="Video ngắn về trang học trên web của LongIELTS"
              >
                <source src="/media/trang-hoc.mp4" type="video/mp4" />
              </video>
            </div>
            <ol className="web-list">
              {b.web.features.map((f) => (
                <li key={f.title}>
                  <button type="button" className="web-item" data-scene={WEB_SCENES[f.scene]} aria-label={`${f.title}. Xem đoạn này trong video`}>
                    <span className="web-item-title">{f.title}</span>
                    <span className="web-item-text">{f.text}</span>
                    <span className="web-item-play" aria-hidden="true">
                      Xem trong video
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── HAI ĐIỀU PHỤ HUYNH YÊN TÂM ── */}
      <section className="ch ground-sheet" data-chapter={b.usps.title} data-num={next()} aria-labelledby="c5">
        <div className="wrap">
          <Title id="c5">{b.usps.title}</Title>
          <div className="usp-grid">
            <article className="usp usp--test" data-in>
              <div className="usp-text">
                <h3>
                  <mark className="nb" data-mark>
                    {b.usps.test.title}
                  </mark>
                </h3>
                <p>{b.usps.test.text}</p>
              </div>
              <TestTiles {...b.usps.test} />
            </article>
            <article className="usp usp--report" data-in>
              <div className="usp-text">
                <h3>
                  <mark className="nb" data-mark>
                    {b.usps.report.title}
                  </mark>
                </h3>
                <p>{b.usps.report.text}</p>
              </div>
              <ReportCard rows={b.usps.report.rows} />
            </article>
          </div>
        </div>
      </section>

      {/* ── HỌC VIÊN NÓI GÌ: một video ── */}
      {video ? (
        <section className="ch ground-navy ch--lan" data-chapter={b.video.title} data-num={next()} aria-labelledby="c6">
          <div className="wrap lan">
            <Title id="c6">{b.video.title}</Title>
            <figure className="lan-video" data-in>
              <video controls playsInline preload="none" poster={b.video.poster} className="lan-player">
                <source src={video.src} type="video/mp4" />
              </video>
              <figcaption>
                {b.video.caption} <span>({b.video.duration})</span>
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      {/* ── KẾT: HỌC PHÍ ── */}
      <section className="ch ground-paper ch--close" data-chapter="Học phí" data-num={next()} aria-labelledby="c7">
        <div className="wrap">
          <Title id="c7">Học phí</Title>
          <div className="close">
            <div className="price-card" data-in>
              <p className="price-basis">{b.pricing.basis}</p>
              <table className="price">
                <caption className="sr-only">Học phí khoá {b.hero.title}</caption>
                <tbody>
                  {b.pricing.plans.map((p) => (
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
              {b.pricing.note ? <p className="price-material">{b.pricing.note}</p> : null}
              <p className="price-material">{b.pricing.material}</p>
            </div>
            <div className="close-side" data-in>
              <p className="trial">
                <mark className="nb" data-mark>
                  {b.pricing.trial}
                </mark>
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href={FORM_URL} target="_blank" rel="noopener noreferrer">
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
              <a href={b.pdf} download>
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
