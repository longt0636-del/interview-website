// Brochure khoá IELTS Căn Bản 4.0-5.0 (Long 16/11/2026) — thay brochure Canva canva.link/s6rchv6njq5zqzi.
// Kiểu "cuốn tài liệu in" chia chương: nền giấy kem ô ly, cam + navy kiểu Vox, mỗi chương một nền, số chương ở lề.
// Điểm nhấn: phiếu điểm IELTS 8.5 của thầy Long tự đóng dấu khi cuộn (score-sheet.tsx + motion.tsx).
// Nội dung nằm ở lib/brochure-can-ban.ts (chung với bản in /khoa-hoc/can-ban/in → PDF ở public/brochure/).
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
  enrol,
  forWho,
  founder,
  hero,
  method,
  outcomes,
  parents,
  pricing,
  roadmap,
  rules,
  stages,
  testimonial,
} from '@/lib/brochure-can-ban'
import { ScoreSheet } from './score-sheet'
import { BrochureMotion } from './motion'

export const metadata: Metadata = {
  // Ảnh xem trước khi gửi link Zalo/Facebook = opengraph-image.png cùng thư mục; cần địa chỉ gốc để ra link tuyệt đối.
  metadataBase: new URL('https://test.longielts.website'),
  alternates: { canonical: '/khoa-hoc/can-ban' },
  title: 'IELTS Căn Bản 4.0-5.0 · Brochure khoá học · LongIELTS',
  description: hero.sub + ' 49 buổi, khoảng 6 tháng, học thử 2 buổi miễn phí.',
  openGraph: {
    title: 'Brochure khoá IELTS Căn Bản 4.0-5.0 · LongIELTS',
    description: 'Lộ trình 49 buổi, mỗi unit 3 buổi, học phí và cách đăng ký học thử.',
    type: 'website',
    locale: 'vi_VN',
  },
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

function ChapterHead({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <header className="ch-head" data-in>
      <p className="ch-num">
        Chương {num}
        <span className="sr-only">: {title}</span>
      </p>
      <h2 className="ch-title">{children}</h2>
    </header>
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

      {/* ── 1. DÀNH CHO AI ── */}
      <section className="ch ground-sheet ch--quiet-end" data-chapter="Khoá này dành cho ai" data-num="1" aria-label="Chương 1: Khoá này dành cho ai">
        <div className="wrap">
          <ChapterHead num="1" title="Khoá này dành cho ai">
            Khoá này <span className="hl">dành cho ai</span>
          </ChapterHead>
          <div className="who">
            <div className="who-main" data-in>
              <p className="lead">{forWho.lead}</p>
              <dl className="facts">
                {forWho.facts.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="who-signs" data-in>
              <p className="side-label">Nghe có giống bạn không?</p>
              <ul>
                {forWho.signs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NGƯỜI XÂY CHƯƠNG TRÌNH (điểm nhấn) ── */}
      <section className="ch ground-navy ch--peak" data-chapter="Người xây chương trình" data-num="2" aria-label="Chương 2: Người xây chương trình">
        <div className="wrap">
          <ChapterHead num="2" title="Người xây chương trình">
            Người xây <span className="hl">chương trình</span>
          </ChapterHead>
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
              <p data-in>{founder.body}</p>
              <p className="teachers" data-in>
                {founder.teachers}
              </p>
              <figure className="photo photo--peak" data-in>
                <div className="photo-frame" data-drift="26">
                  <Image
                    src="/students/class-photo-3.jpg"
                    alt={founder.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 480px, 92vw"
                    className="photo-img"
                  />
                </div>
                <figcaption>{founder.photoCaption}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MỖI UNIT 3 BUỔI ── */}
      <section className="ch ground-paper" data-chapter="Mỗi unit học trong 3 buổi" data-num="3" aria-label="Chương 3: Mỗi unit học trong 3 buổi">
        <div className="wrap">
          <ChapterHead num="3" title="Mỗi unit học trong 3 buổi">
            Mỗi unit học trong <span className="hl">3 buổi</span>
          </ChapterHead>
          <p className="lead" data-in>
            {method.lead}
          </p>
          <ol className="sessions">
            {method.sessions.map((s, i) => (
              <li key={s.n} className="session" data-reveal>
                <span className="s-n" aria-hidden="true">
                  {s.n}
                </span>
                <div className="s-body">
                  <h3>
                    <span className="sr-only">Buổi {s.n}: </span>
                    {s.title}
                  </h3>
                  <p>{s.text}</p>
                </div>
                <div className="s-thread" aria-hidden="true">
                  <span className="chip">{method.example.words.join(' · ')}</span>
                  <span className="s-thread-label">
                    {i === 0 ? 'gặp lần đầu' : i === 1 ? 'trong bài ngữ pháp' : 'trong đoạn văn dịch'}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <p className="example" data-in>
            <b>{method.example.label}:</b> {method.example.words.join(', ')} {method.example.text}
          </p>
          <p className="note" data-in>
            {method.games}
          </p>
        </div>
      </section>

      {/* ── 4. LỘ TRÌNH ── */}
      <section className="ch ground-sheet" data-chapter="Lộ trình 49 buổi" data-num="4" aria-label="Chương 4: Lộ trình 49 buổi">
        <div className="wrap">
          <ChapterHead num="4" title="Lộ trình 49 buổi">
            Lộ trình <span className="hl">49 buổi</span>
          </ChapterHead>

          <div className="ky-row" data-in>
            <span className="ky-tag">{roadmap.ky1.title}</span>
            <span className="ky-meta">{roadmap.ky1.meta}</span>
          </div>
          <div className="stages">
            {stages.map((st) => (
              <section className="stage" key={st.label} data-in aria-label={`${st.label}, ${st.range}`}>
                <h3 className="stage-head">
                  {st.label} <span>· {st.range}</span>
                </h3>
                <ol className="units">
                  {st.units.map((u) => (
                    <li key={u.n}>
                      <span className="u-n">Unit {u.n}</span>
                      <span className="u-en">{u.en}</span>
                      <span className="u-vi">{u.vi}</span>
                      <span className="u-gr">
                        <b>Ngữ pháp:</b> {u.gr}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="test">
                  <b>Test {st.test.n}</b>
                  <span>buổi {st.test.at}</span>
                </p>
              </section>
            ))}
          </div>
          <p className="note" data-in>
            {roadmap.testNote}
          </p>

          <div className="ky-row ky-row--2" data-in>
            <span className="ky-tag">{roadmap.ky2.title}</span>
            <span className="ky-meta">{roadmap.ky2.meta}</span>
          </div>
          <ol className="ky2" data-in>
            {roadmap.ky2.sessions.map((s, i) => (
              <li key={s} className={s.startsWith('Test') ? 'is-test' : undefined}>
                <span className="ky2-i">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="note" data-in>
            {roadmap.ky2.note}
          </p>
        </div>
      </section>

      {/* ── 5. HỌC XONG CÓ GÌ ── */}
      <section className="ch ground-amber" data-chapter="Học xong khoá, bạn có gì" data-num="5" aria-label="Chương 5: Học xong khoá, bạn có gì">
        <div className="wrap wrap--split" data-reveal>
          <ChapterHead num="5" title="Học xong khoá, bạn có gì">
            Học xong khoá, bạn có gì
          </ChapterHead>
          <div>
            <ol className="outcomes">
              {outcomes.items.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
            <p className="target">{outcomes.target}</p>
          </div>
        </div>
      </section>

      {/* ── 6. DÀNH CHO PHỤ HUYNH ── */}
      <section className="ch ground-paper" data-chapter="Dành cho phụ huynh" data-num="6" aria-label="Chương 6: Dành cho phụ huynh">
        <div className="wrap">
          <ChapterHead num="6" title="Dành cho phụ huynh">
            Dành cho <span className="hl">phụ huynh</span>
          </ChapterHead>
          <div className="parents">
            <figure className="photo photo--parents" data-in>
              <span className="tape tape--photo" aria-hidden="true" />
              <div className="photo-frame" data-drift="34">
                <Image src="/students/class-group.jpg" alt={parents.photoAlt} fill sizes="(min-width: 1024px) 460px, 92vw" className="photo-img" />
              </div>
              <figcaption>{parents.photoCaption}</figcaption>
            </figure>
            <div className="parents-text">
              <p className="lead" data-in>
                {parents.lead}
              </p>
              <dl className="channels" data-in>
                {parents.items.map((it) => (
                  <div key={it.k}>
                    <dt>{it.k}</dt>
                    <dd>{it.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="ask" data-in>
                {parents.ask}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. HỌC VIÊN NÓI GÌ ── */}
      <section className="ch ground-navy" data-chapter="Học viên nói gì" data-num="7" aria-label="Chương 7: Học viên nói gì">
        <div className="wrap">
          <ChapterHead num="7" title="Học viên nói gì">
            Học viên <span className="hl">nói gì</span>
          </ChapterHead>
          <div className="voice">
            <blockquote className="quote" data-in>
              {testimonial.quote.map((q) => (
                <p key={q.slice(0, 20)}>{q}</p>
              ))}
              <footer>
                <b>{testimonial.name}</b>, {testimonial.who}
              </footer>
            </blockquote>
            <figure className="photo photo--voice" data-in>
              <div className="photo-frame photo-frame--square">
                <Image src="/students/stars-of-the-month.jpg" alt={testimonial.photoAlt} fill sizes="(min-width: 1024px) 360px, 92vw" className="photo-img" />
              </div>
              <figcaption>{testimonial.photoCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── KẾT: HỌC PHÍ VÀ ĐĂNG KÝ ── */}
      <section className="ch ground-paper ch--close" data-chapter="Học phí và đăng ký" data-num="8" aria-label="Học phí và đăng ký">
        <div className="wrap">
          <ChapterHead num="8" title="Học phí và đăng ký">
            Học phí và <span className="hl">đăng ký</span>
          </ChapterHead>
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
              <ul className="price-notes">
                {pricing.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>

            <div className="close-side">
              <div className="rules" data-in>
                <div>
                  <h3>Quyền lợi</h3>
                  <ul>
                    {rules.rights.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Nghĩa vụ</h3>
                  <ul>
                    {rules.duties.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="enrol" data-in>
                <h3>Đăng ký học thử trong 3 bước</h3>
                <ol>
                  {enrol.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <div className="cta-row">
                  <a className="btn btn-primary" href={BROCHURE_FORM_URL} target="_blank" rel="noopener noreferrer">
                    Đăng ký học thử
                  </a>
                  <a className="btn btn-ghost" href={ZALO_URL} target="_blank" rel="noopener noreferrer">
                    <ChatIcon />
                    Zalo {ZALO_DISPLAY}
                  </a>
                </div>
              </div>
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
