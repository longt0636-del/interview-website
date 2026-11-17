// Bản in A4 dùng chung cho brochure 3 khoá (6 trang; luật "tài liệu gửi học sinh tối đa 6 trang").
// Xuất PDF bằng Playwright page.pdf({ preferCSSPageSize, printBackground }) sau khi ẩn nextjs-portal (memory project-brochure-can-ban).
// Không gắn link công khai tới các trang /in. Hình động đứng yên ở trạng thái cuối.
/* eslint-disable @next/next/no-img-element -- bản in cần ảnh gốc tải ngay, không qua bộ tối ưu ảnh */
import type { Metadata } from 'next'
import './brochure.css'
import './print.css'
import { bvp, lora } from '@/lib/brochure-fonts'
import { ADDRESS, PORTAL, SITE, SITE_HOST, UPDATED, ZALO_DISPLAY, type Brochure } from '@/lib/brochures/shared'
import { ScoreSheet } from './score-sheet'
import { DayArt, ReportCard, TeacherCard, TestTiles, Timeline } from './parts'
import { Marked } from './BrochurePage'

export function printMetadata(b: Brochure): Metadata {
  return { metadataBase: new URL(SITE), title: `Bản in · ${b.metaTitle}`, robots: { index: false, follow: false } }
}

const TOTAL = 6

function Foot({ n, name }: { n: number; name: string }) {
  return (
    <footer className="pg-foot">
      <span>LongIELTS · Brochure {name}</span>
      <span>
        {n}/{TOTAL}
      </span>
    </footer>
  )
}

export function BrochurePrint({ b }: { b: Brochure }) {
  const name = /^\d/.test(b.hero.from) ? `${b.hero.title} ${b.hero.from}-${b.hero.to}` : b.hero.title
  return (
    <main className={`bro bro-print ${bvp.variable} ${lora.variable}`} lang="vi">
      {/* 1 · Bìa + dành cho ai */}
      <section className="pg ground-paper">
        <div className="p-cover">
          <p className="p-brand">
            <span className="wordmark-box">LongIELTS</span>
            <span>Brochure khoá học</span>
          </p>
          <h1 className="h1">
            <span className="h1-box">{b.hero.title}</span>
            <span className="h1-band">
              {b.hero.from} → {b.hero.to}
            </span>
          </h1>
          <p className="hero-sub">{b.hero.sub}</p>
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
          <h2 className="p-title">{b.forWho.title}</h2>
          <p className="big-line">
            <Marked text={b.forWho.line1} live={false} />
          </p>
          <p className="big-line big-line--2">
            <Marked text={b.forWho.line2} live={false} />
          </p>
          <Timeline t={b.forWho.timeline} />
        </div>
        <Foot n={1} name={name} />
      </section>

      {/* 2 · Người dạy */}
      <section className={`pg ground-navy${b.teachers.length ? '' : ' pg--solo'}`}>
        <h2 className="p-title">Người dạy</h2>
        <div className="p-peak">
          <div className="p-peak-text">
            <p className="peak-name">
              Thầy Trần Nhật Long
              <span>{b.founderRole}</span>
            </p>
            <ul className="creds">
              {b.founderCreds.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {b.founderPhoto ? (
              <figure className="p-photo p-photo--founder">
                <img src={b.founderPhoto.src} alt={b.founderPhoto.alt} />
                <figcaption>{b.founderPhoto.caption}</figcaption>
              </figure>
            ) : null}
          </div>
          <ScoreSheet />
        </div>
        {b.teachers.length ? (
          <>
            <h3 className="team-title">{b.teamTitle}</h3>
            <div className="p-team">
              {b.teachers.map((t) => (
                <TeacherCard key={t.id} t={t} print />
              ))}
            </div>
            {b.teachersNote ? <p className="team-note">{b.teachersNote}</p> : null}
          </>
        ) : null}
        <Foot n={2} name={name} />
      </section>

      {/* 3 · Mỗi unit học gì */}
      <section className="pg ground-paper">
        <h2 className="p-title">{b.sessionsTitle}</h2>
        <ol className={`days days--n${b.sessions.length}`}>
          {b.sessions.map((s, i) => (
            <li key={s.n} className={`day day--${(i % 3) + 1}`}>
              <div className="day-text">
                <p className="day-n">
                  {b.sessionLabel} {s.n}
                </p>
                <h3 className="day-title">
                  <mark className="nb">{s.title}</mark>
                  {s.isNew ? <span className="tag-new">Mới: {s.isNew}</span> : null}
                </h3>
                {s.sub ? <p className="day-sub">{s.sub}</p> : null}
              </div>
              <DayArt arts={s.arts} text={b.artText} />
            </li>
          ))}
        </ol>
        <Foot n={3} name={name} />
      </section>

      {/* 4 · Trang học riêng */}
      <section className="pg ground-navy">
        <h2 className="p-title">{b.web.title}</h2>
        <p className="web-lead">
          <Marked text={b.web.lead} live={false} />
        </p>
        <div className="p-web">
          <div className="phone phone--web">
            <img className="phone-video" src="/media/trang-hoc-poster.jpg" alt="Trang học trên web: thầy sửa ngay trên bài em viết" />
          </div>
          <ol className="web-list">
            {b.web.features.map((f) => (
              <li key={f.title} className="web-item">
                <span className="web-item-title">{f.title}</span>
                <span className="web-item-text">{f.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="p-web-url">Mở trên điện thoại: {PORTAL}</p>
        <Foot n={4} name={name} />
      </section>

      {/* 5 · Kiểm tra định kỳ + báo cáo tháng */}
      <section className="pg ground-sheet">
        <h2 className="p-title">{b.usps.title}</h2>
        <article className="usp usp--test usp--p">
          <div className="usp-text">
            <h3>
              <mark className="nb">{b.usps.test.title}</mark>
            </h3>
            <p>{b.usps.test.text}</p>
          </div>
          <TestTiles {...b.usps.test} />
        </article>
        <article className="usp usp--report usp--p">
          <div className="usp-text">
            <h3>
              <mark className="nb">{b.usps.report.title}</mark>
            </h3>
            <p>{b.usps.report.text}</p>
          </div>
          <ReportCard rows={b.usps.report.rows} />
        </article>
        <Foot n={5} name={name} />
      </section>

      {/* 6 · Học viên + học phí + liên hệ */}
      <section className="pg ground-paper">
        <div className="p-last">
          <div className="p-lan ground-navy">
            <h2 className="p-title p-title--sm">{b.video.title}</h2>
            <img src={b.video.poster} alt={b.video.caption} className="p-lan-img" />
            <p className="p-lan-cap">
              {b.video.caption} Xem video ({b.video.duration}) trên bản web, quét mã bên cạnh.
            </p>
          </div>
          <div>
            <h2 className="p-title">Học phí</h2>
            <div className="price-card">
              <p className="price-basis">{b.pricing.basis}</p>
              <table className="price">
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
            <p className="trial">
              <mark className="nb">{b.pricing.trial}</mark>
            </p>
            <div className="p-contact ground-navy">
              <img className="p-qr" src={`/brochure/qr-${b.slug}.svg`} alt="Mã QR mở brochure trên web" />
              <div>
                <p className="p-contact-k">Quét mã: bản web, video, đăng ký</p>
                <p className="p-contact-v">
                  {SITE_HOST}
                  <br />
                  {b.path}
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
        <Foot n={6} name={name} />
      </section>
    </main>
  )
}
