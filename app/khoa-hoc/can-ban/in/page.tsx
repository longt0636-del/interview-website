// Bản in A4 của brochure IELTS Căn Bản (5 trang; luật "tài liệu gửi học sinh tối đa 6 trang").
// Xuất PDF ở public/brochure/ielts-can-ban-4-5.pdf bằng Playwright page.pdf({ preferCSSPageSize, printBackground })
// sau khi ẩn nextjs-portal (xem memory project-brochure-can-ban). Nội dung chung với trang web (lib/brochure-can-ban.ts).
// Không gắn link công khai tới trang này. Hình động đứng yên ở trạng thái cuối.
/* eslint-disable @next/next/no-img-element -- bản in cần ảnh gốc tải ngay, không qua bộ tối ưu ảnh */
import type { Metadata } from 'next'
import '../brochure.css'
import './print.css'
import { bvp, lora } from '@/lib/brochure-fonts'
import {
  ADDRESS,
  UPDATED,
  ZALO_DISPLAY,
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
import { ScoreSheet } from '../score-sheet'
import { DayArt, ReportCard, TestTiles, Timeline } from '../parts'

export const metadata: Metadata = {
  metadataBase: new URL('https://test.longielts.website'),
  title: 'Bản in · Brochure IELTS Căn Bản 4.0-5.0 · LongIELTS',
  robots: { index: false, follow: false },
}

const TOTAL = 5
const WEB_HOST = 'test.longielts.website'
const WEB_PATH = '/khoa-hoc/can-ban'

function Marked({ text }: { text: string }) {
  return (
    <>
      {splitMarks(text).map((p, i) =>
        p.mark ? (
          <mark key={i} className="nb">
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  )
}

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
          <h2 className="p-title">{forWho.title}</h2>
          <p className="big-line">
            <Marked text={forWho.line1} />
          </p>
          <p className="big-line big-line--2">
            <Marked text={forWho.line2} />
          </p>
          <Timeline t={forWho.timeline} />
        </div>
        <Foot n={1} />
      </section>

      {/* 2 · Người dạy */}
      <section className="pg ground-navy">
        <h2 className="p-title">Người dạy</h2>
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
            <figure className="p-photo">
              <img src="/students/class-photo-3.jpg" alt={founder.photoAlt} />
              <figcaption>{founder.photoCaption}</figcaption>
            </figure>
          </div>
          <ScoreSheet />
        </div>
        <h3 className="team-title">Đứng lớp cùng thầy</h3>
        <div className="p-team">
          {teachers.map((t) => (
            <article className="tcard" key={t.id}>
              <div className="tcard-photo">
                {t.photo ? (
                  <img src={t.photo} alt={t.photoAlt} className="p-tcard-img" />
                ) : (
                  <span className="tcard-mono" aria-hidden="true">
                    {t.name.replace('Cô ', '').charAt(0)}
                  </span>
                )}
              </div>
              <div className="tcard-body">
                <h4 className="tcard-name">{t.name}</h4>
                <p className="tcard-badge">{t.badge}</p>
                <ul className="tcard-points">
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className="team-note">{teachersNote}</p>
        <Foot n={2} />
      </section>

      {/* 3 · Mỗi unit, 3 buổi */}
      <section className="pg ground-paper">
        <h2 className="p-title">Mỗi unit, 3 buổi</h2>
        <ol className="days">
          {sessions.map((s) => (
            <li key={s.n} className={`day day--${s.n}`}>
              <div className="day-text">
                <p className="day-n">Buổi {s.n}</p>
                <h3 className="day-title">
                  <mark className="nb">{s.title}</mark>
                  {s.isNew ? <span className="tag-new">Mới: {s.isNew}</span> : null}
                </h3>
                {s.sub ? <p className="day-sub">{s.sub}</p> : null}
              </div>
              <DayArt n={s.n} />
            </li>
          ))}
        </ol>
        <Foot n={3} />
      </section>

      {/* 4 · Ba điều phụ huynh yên tâm */}
      <section className="pg ground-sheet">
        <h2 className="p-title">{usps.title}</h2>
        <article className="usp usp--test">
          <div className="usp-text">
            <h3>
              <mark className="nb">{usps.test.title}</mark>
            </h3>
            <p>{usps.test.text}</p>
          </div>
          <TestTiles />
        </article>
        <div className="p-usp2">
          <article className="usp usp--web">
            <div className="usp-text">
              <h3>
                <mark className="nb">{usps.web.title}</mark>
              </h3>
              <p>{usps.web.text}</p>
            </div>
            <div className="phone">
              <img className="phone-video" src="/media/trang-hoc-poster.jpg" alt="Trang học trên web: thầy sửa ngay trên bài em viết" />
            </div>
          </article>
          <article className="usp usp--report">
            <div className="usp-text">
              <h3>
                <mark className="nb">{usps.report.title}</mark>
              </h3>
              <p>{usps.report.text}</p>
            </div>
            <ReportCard rows={usps.report.rows} />
          </article>
        </div>
        <Foot n={4} />
      </section>

      {/* 5 · Học viên + học phí + liên hệ */}
      <section className="pg ground-paper">
        <div className="p-last">
          <div className="p-lan ground-navy">
            <h2 className="p-title p-title--sm">{lan.title}</h2>
            <img src={lan.poster} alt="Video Trương Ngọc Lan, IELTS 7.5" className="p-lan-img" />
            <p className="p-lan-cap">
              {lan.caption} Xem video ({lan.duration}) trên bản web, quét mã bên cạnh.
            </p>
          </div>
          <div>
            <h2 className="p-title">Học phí</h2>
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
              <p className="price-material">{pricing.material}</p>
            </div>
            <p className="trial">
              <mark className="nb">{pricing.trial}</mark>
            </p>
            <div className="p-contact ground-navy">
              <img className="p-qr" src="/brochure/qr-can-ban.svg" alt="Mã QR mở brochure trên web" />
              <div>
                <p className="p-contact-k">Quét mã: bản web, video, đăng ký</p>
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
        </div>
        <p className="p-small p-updated">Cập nhật {UPDATED}</p>
        <Foot n={5} />
      </section>
    </main>
  )
}
