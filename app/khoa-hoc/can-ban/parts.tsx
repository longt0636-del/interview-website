// Các mảnh hình + chuyển động "làm bằng chứng" cho từng ý của brochure (Long 16/11/2026: mỗi ý phải có hình hoặc chuyển động).
// Không có JS / bản in / máy bật giảm chuyển động: mọi thứ hiện ở trạng thái cuối, đứng yên.
import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Teacher } from '@/lib/brochure-can-ban'

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Chương 1: thước 24 tháng (1-2 năm chuẩn bị), 6 tháng đầu là khoá Căn Bản. Đoạn cam tô dần theo cuộn. */
export function Timeline({ t }: { t: { total: string; course: string; after: string } }) {
  return (
    <figure className="tl" data-in data-fill aria-label={`${t.total}. ${t.course}, sau đó ${t.after}.`}>
      <figcaption className="tl-total" aria-hidden="true">
        {t.total}
      </figcaption>
      <div className="tl-track" aria-hidden="true">
        <span className="tl-course" />
        <span className="tl-after" />
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className={`tl-tick${i % 6 === 0 ? ' tl-tick--big' : ''}`} style={{ left: `${(i / 24) * 100}%` }} />
        ))}
      </div>
      <div className="tl-labels" aria-hidden="true">
        <span className="tl-l1">{t.course}</span>
        <span className="tl-l2">{t.after}</span>
      </div>
      <div className="tl-ends" aria-hidden="true">
        <span style={{ left: '0%' }}>Bắt đầu</span>
        <span style={{ left: '25%' }}>6 tháng</span>
        <span style={{ left: '50%' }}>1 năm</span>
        <span style={{ left: '100%' }}>2 năm</span>
      </div>
    </figure>
  )
}

/** Chương 2: thẻ cô giáo (ảnh mặt + 2-3 gạch đầu dòng). Chưa có ảnh thì hiện chữ cái đầu. */
export function TeacherCard({ t }: { t: Teacher }) {
  return (
    <article className="tcard" data-in>
      <div className="tcard-photo">
        {t.photo ? (
          <Image src={t.photo} alt={t.photoAlt} fill sizes="(min-width: 960px) 200px, 40vw" className="tcard-img" />
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
  )
}

/** Chương 3: hình động nhỏ cho từng buổi. */
export function DayArt({ n }: { n: string }) {
  if (n === '1')
    return (
      <div className="art art--1" aria-hidden="true">
        <div className="flip">
          <div className="flip-in">
            <span className="flip-f">mass tourism</span>
            <span className="flip-b">du lịch đại trà</span>
          </div>
        </div>
        <div className="wave">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as Vars} />
          ))}
        </div>
      </div>
    )
  if (n === '2')
    return (
      <div className="art art--2" aria-hidden="true">
        <p className="gram">
          Mass tourism <span className="gram-hl">has changed</span> many small towns.
        </p>
        <div className="read">
          <i className="read-hl" />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  return (
    <div className="art art--3" aria-hidden="true">
      <svg className="pen" viewBox="0 0 240 44" preserveAspectRatio="none">
        <path pathLength={1} d="M6 32 C 28 6, 46 38, 70 20 S 112 8, 134 26 S 176 34, 200 16 S 226 12, 234 22" />
      </svg>
      <div className="bubble">
        <span className="pair">
          <b>ship</b> /ɪ/
        </span>
        <span className="pair pair--2">
          <b>sheep</b> /iː/
        </span>
      </div>
    </div>
  )
}

/** Chương 4 · điểm 1: 12 unit, cứ hết 3 unit là một con dấu TEST rơi xuống. */
export function TestTiles() {
  const groups = [1, 2, 3, 4]
  return (
    <div className="tiles" role="img" aria-label="12 unit, cứ học xong 3 unit có 1 bài kiểm tra: sau Unit 3, 6, 9 và 12.">
      {groups.map((g) => (
        <div className="tiles-group" key={g}>
          {[1, 2, 3].map((k) => {
            const u = (g - 1) * 3 + k
            return (
              <span className="tile" key={u}>
                Unit {u}
              </span>
            )
          })}
          <span className="tile-test" style={{ '--k': g } as Vars}>
            Test {g}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Chương 4 · điểm 3: phiếu báo cáo tháng (minh hoạ, không có số liệu giả), từng dòng được tick dần. */
export function ReportCard({ rows }: { rows: string[] }) {
  return (
    <div className="report" role="img" aria-label={`Minh hoạ báo cáo tháng gửi phụ huynh: ${rows.join(', ')}.`}>
      <span className="tape tape--report" aria-hidden="true" />
      <div className="report-head" aria-hidden="true">
        <span className="report-title">Báo cáo tháng</span>
        <span className="report-tag">Minh hoạ</span>
      </div>
      <ul className="report-rows" aria-hidden="true">
        {rows.map((r, i) => (
          <li key={r} style={{ '--i': i } as Vars}>
            <span className="chk">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5 10 17 19 7" />
              </svg>
            </span>
            {r}
          </li>
        ))}
      </ul>
      <p className="report-send" aria-hidden="true">
        Gửi phụ huynh qua Zalo
      </p>
    </div>
  )
}
