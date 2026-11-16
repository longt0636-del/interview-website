// Bản in A4 của brochure IELTS Căn Bản (6 trang, luật "tài liệu gửi học sinh tối đa 6 trang").
// Dùng để xuất PDF ở public/brochure/ielts-can-ban-4-5.pdf:
//   chrome --headless=new --no-pdf-header-footer --print-to-pdf=public/brochure/ielts-can-ban-4-5.pdf <web>/khoa-hoc/can-ban/in
// Nội dung chung với trang web (lib/brochure-can-ban.ts). Không gắn link công khai tới trang này.
/* eslint-disable @next/next/no-img-element -- bản in cần ảnh gốc tải ngay, không qua bộ tối ưu ảnh */
import type { Metadata } from 'next'
import '../brochure.css'
import './print.css'
import { bvp, lora } from '@/lib/brochure-fonts'
import {
  ADDRESS,
  UPDATED,
  ZALO_DISPLAY,
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
import { ScoreSheet } from '../score-sheet'

export const metadata: Metadata = {
  metadataBase: new URL('https://test.longielts.website'),
  title: 'Bản in · Brochure IELTS Căn Bản 4.0-5.0 · LongIELTS',
  robots: { index: false, follow: false },
}

const TOTAL = 6
const WEB_HOST = 'test.longielts.website'
const WEB_PATH = '/khoa-hoc/can-ban'

function Foot({ n }: { n: number }) {
  return (
    <footer className="pg-foot">
      <span>LongIELTS · Brochure IELTS Căn Bản 4.0-5.0</span>
      <span>
        {n}/{TOTAL}
      </span>
    </footer>
  )
}

function H({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <header className="p-head">
      <p className="ch-num">Chương {num}</p>
      <h2 className="p-title">{children}</h2>
    </header>
  )
}

export default function BrochurePrintPage() {
  return (
    <main className={`bro bro-print ${bvp.variable} ${lora.variable}`} lang="vi">
      {/* 1 · Bìa + dành cho ai */}
      <section className="pg ground-paper">
        <div className="p-cover">
          <p className="p-brand">
            <span className="wordmark-box">LongIELTS</span>
            <span>{hero.eyebrow.replace('LongIELTS · ', '')}</span>
          </p>
          <h1 className="h1">
            <span className="h1-box">{hero.title}</span>
            <span className="h1-band">
              {hero.from} → {hero.to}
            </span>
          </h1>
          <p className="hero-sub">{hero.sub}</p>
          <dl className="p-facts">
            {forWho.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="p-cover-sheet" aria-hidden="true">
            <span className="tape tape--hero" />
            <div className="trf-top">
              <span className="trf-logo">IELTS</span>
              <span className="trf-kind">Kết quả · Academic</span>
            </div>
            <div className="hero-sheet-score">
              Overall <b>8.5</b>
            </div>
          </div>
        </div>
        <div className="p-who">
          <H num="1">
            Khoá này <span className="hl">dành cho ai</span>
          </H>
          <div className="p-who-grid">
            <p className="p-lead">{forWho.lead}</p>
            <div>
              <p className="side-label">Nghe có giống bạn không?</p>
              <ul className="p-signs">
                {forWho.signs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Foot n={1} />
      </section>

      {/* 2 · Người xây chương trình */}
      <section className="pg ground-navy">
        <H num="2">
          Người xây <span className="hl">chương trình</span>
        </H>
        <div className="p-peak">
          <div className="p-peak-text">
            <p className="peak-name">
              {founder.name}
              <span>{founder.role}</span>
            </p>
            <ul className="creds">
              {founder.creds.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>{founder.body}</p>
            <p className="teachers">{founder.teachers}</p>
          </div>
          <ScoreSheet />
        </div>
        <figure className="p-photo">
          <img src="/students/class-photo-3.jpg" alt={founder.photoAlt} />
          <figcaption>{founder.photoCaption}</figcaption>
        </figure>
        <Foot n={2} />
      </section>

      {/* 3 · Mỗi unit 3 buổi + học xong có gì */}
      <section className="pg ground-sheet">
        <H num="3">
          Mỗi unit học trong <span className="hl">3 buổi</span>
        </H>
        <p className="p-lead">{method.lead}</p>
        <ol className="p-sessions">
          {method.sessions.map((s, i) => (
            <li key={s.n}>
              <span className="s-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <div className="p-thread">
                <span className="chip">{method.example.words.join(' · ')}</span>
                <span className="s-thread-label">
                  {i === 0 ? 'gặp lần đầu' : i === 1 ? 'trong bài ngữ pháp' : 'trong đoạn văn dịch'}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <p className="p-small">{method.games}</p>
        <div className="p-outcomes ground-amber">
          <h2 className="p-title p-title--sm">
            <span className="p-num">Chương 5 · </span>Học xong khoá, bạn có gì
          </h2>
          <ol className="outcomes">
            {outcomes.items.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
          <p className="target">{outcomes.target}</p>
        </div>
        <Foot n={3} />
      </section>

      {/* 4 · Lộ trình */}
      <section className="pg ground-sheet">
        <H num="4">
          Lộ trình <span className="hl">49 buổi</span>
        </H>
        <div className="ky-row">
          <span className="ky-tag">{roadmap.ky1.title}</span>
          <span className="ky-meta">{roadmap.ky1.meta}</span>
        </div>
        <div className="p-stages">
          {stages.map((st) => (
            <section className="stage" key={st.label}>
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
        <p className="p-small">{roadmap.testNote}</p>
        <div className="ky-row ky-row--p2">
          <span className="ky-tag">{roadmap.ky2.title}</span>
          <span className="ky-meta">{roadmap.ky2.meta}</span>
        </div>
        <ol className="ky2">
          {roadmap.ky2.sessions.map((s, i) => (
            <li key={s} className={s.startsWith('Test') ? 'is-test' : undefined}>
              <span className="ky2-i">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <p className="p-small">{roadmap.ky2.note}</p>
        <Foot n={4} />
      </section>

      {/* 5 · Phụ huynh + học viên */}
      <section className="pg ground-paper">
        <H num="6">
          Dành cho <span className="hl">phụ huynh</span>
        </H>
        <div className="p-parents">
          <figure className="p-photo p-photo--side">
            <img src="/students/class-group.jpg" alt={parents.photoAlt} />
            <figcaption>{parents.photoCaption}</figcaption>
          </figure>
          <div>
            <p className="p-lead">{parents.lead}</p>
            <dl className="channels">
              {parents.items.map((it) => (
                <div key={it.k}>
                  <dt>{it.k}</dt>
                  <dd>{it.v}</dd>
                </div>
              ))}
            </dl>
            <p className="ask">{parents.ask}</p>
          </div>
        </div>
        <div className="p-voice ground-navy">
          <div>
            <p className="ch-num">Chương 7 · Học viên nói gì</p>
            <blockquote className="quote">
              {testimonial.quote.map((q) => (
                <p key={q.slice(0, 20)}>{q}</p>
              ))}
              <footer>
                <b>{testimonial.name}</b>, {testimonial.who}
              </footer>
            </blockquote>
          </div>
          <figure className="p-photo p-photo--voice">
            <img src="/students/stars-of-the-month.jpg" alt={testimonial.photoAlt} />
            <figcaption>{testimonial.photoCaption}</figcaption>
          </figure>
        </div>
        <Foot n={5} />
      </section>

      {/* 6 · Học phí + đăng ký */}
      <section className="pg ground-paper">
        <H num="8">
          Học phí và <span className="hl">đăng ký</span>
        </H>
        <div className="p-close">
          <div className="price-card">
            <p className="price-basis">{pricing.basis}</p>
            <table className="price">
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
          <div className="rules rules--p">
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
        </div>
        <div className="p-enrol">
          <div className="enrol">
            <h3>Đăng ký học thử trong 3 bước</h3>
            <ol>
              {enrol.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="p-contact ground-navy">
            <img className="p-qr" src="/brochure/qr-can-ban.svg" alt="Mã QR mở brochure trên web" />
            <div>
              <p className="p-contact-k">Quét mã để xem bản web và đăng ký</p>
              <p className="p-contact-v">
                {WEB_HOST}
                <br />
                {WEB_PATH}
              </p>
              <p className="p-contact-k">Zalo thầy Long</p>
              <p className="p-contact-v">{ZALO_DISPLAY}</p>
              <p className="p-contact-k">Địa chỉ lớp</p>
              <p className="p-contact-v">{ADDRESS}</p>
            </div>
          </div>
        </div>
        <p className="p-small p-updated">Cập nhật {UPDATED}</p>
        <Foot n={6} />
      </section>
    </main>
  )
}
