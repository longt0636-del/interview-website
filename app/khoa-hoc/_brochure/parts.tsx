// Các mảnh hình + chuyển động "làm bằng chứng" cho từng ý của brochure (Long 16/11/2026: mỗi ý phải có hình hoặc chuyển động).
// Dùng chung cho 3 khoá. Không có JS / bản in / máy bật giảm chuyển động: mọi thứ hiện ở trạng thái cuối, đứng yên.
import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { ArtKey, Seg, Teacher } from '@/lib/brochures/shared'

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Chương 1: đường thời gian theo tháng; đoạn "course" là khoá đang giới thiệu (tô cam, tô dần theo cuộn). */
export function Timeline({ t }: { t: { caption: string; segs: Seg[]; ends: { at: number; label: string }[] } }) {
  const total = t.segs.reduce((a, s) => a + s.months, 0)
  const step = total <= 24 ? 1 : 3
  const parts = t.segs.map((s, i) => {
    const start = t.segs.slice(0, i).reduce((a, x) => a + x.months, 0)
    return { ...s, left: (start / total) * 100, width: (s.months / total) * 100 }
  })
  const bigAt = new Set(parts.map((p) => Math.round(p.left * 100)).concat([10000]))
  const label = t.segs.map((s) => s.label).join(', sau đó ')
  return (
    <figure className="tl" data-in data-fill aria-label={`${t.caption}. ${label}.`}>
      <figcaption className="tl-total" aria-hidden="true">
        {t.caption}
      </figcaption>
      <div className="tl-track" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={i} className={`tl-seg tl-seg--${p.kind}`} style={{ left: `${p.left}%`, width: `${p.width}%` }} />
        ))}
        {Array.from({ length: Math.floor(total / step) + 1 }).map((_, i) => {
          const at = ((i * step) / total) * 100
          return (
            <span
              key={i}
              className={`tl-tick${bigAt.has(Math.round(at * 100)) ? ' tl-tick--big' : ''}`}
              style={{ left: `${at}%` }}
            />
          )
        })}
      </div>
      <div className="tl-ends" aria-hidden="true">
        {t.ends.map((e, i) => (
          <span key={i} style={{ left: `${(e.at / total) * 100}%` }}>
            {e.label}
          </span>
        ))}
      </div>
      <div className="tl-labels" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={i} className={`tl-l tl-l--${p.kind}`}>
            {p.label}
          </span>
        ))}
      </div>
    </figure>
  )
}

/** Thẻ giáo viên (ảnh mặt + 2-3 gạch đầu dòng). Chưa có ảnh thì hiện chữ cái đầu. */
export function TeacherCard({ t, print = false }: { t: Teacher; print?: boolean }) {
  return (
    <article className="tcard" data-in>
      <div className="tcard-photo">
        {t.photo ? (
          print ? (
            // eslint-disable-next-line @next/next/no-img-element -- bản in cần ảnh gốc tải ngay
            <img src={t.photo} alt={t.photoAlt} className="p-tcard-img" />
          ) : (
            <Image src={t.photo} alt={t.photoAlt} fill sizes="(min-width: 560px) 150px, 112px" className="tcard-img" />
          )
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

/** Hình động nhỏ theo loại hoạt động. */
type ArtText = { front?: string; back?: string; gram?: [string, string, string]; speakQ?: string }

export function ArtPiece({ k, text = {} }: { k: ArtKey; text?: ArtText }) {
  switch (k) {
    case 'flashcard':
      return (
        <div className="flip">
          <div className="flip-in">
            <span className="flip-f">{text.front ?? 'mass tourism'}</span>
            <span className="flip-b">{text.back ?? 'du lịch đại trà'}</span>
          </div>
        </div>
      )
    case 'wave':
      return (
        <div className="wave">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as Vars} />
          ))}
        </div>
      )
    case 'grammar':
      return (
        <p className="gram">
          {(text.gram ?? ['Mass tourism ', 'has changed', ' many small towns.'])[0]}
          <span className="gram-hl">{(text.gram ?? ['', 'has changed', ''])[1]}</span>
          {(text.gram ?? ['', '', ' many small towns.'])[2]}
        </p>
      )
    case 'read':
      return (
        <div className="read">
          <i className="read-hl" />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
    case 'pen':
      return (
        <svg className="pen" viewBox="0 0 240 44" preserveAspectRatio="none">
          <path pathLength={1} d="M6 32 C 28 6, 46 38, 70 20 S 112 8, 134 26 S 176 34, 200 16 S 226 12, 234 22" />
        </svg>
      )
    case 'ship':
      return (
        <div className="bubble">
          <span className="pair">
            <b>ship</b> /ɪ/
          </span>
          <span className="pair pair--2">
            <b>sheep</b> /iː/
          </span>
        </div>
      )
    case 'ipa':
      return (
        <div className="ipa">
          {['/iː/', '/ɪ/', '/æ/', '/ʌ/', '/θ/', '/ð/'].map((s, i) => (
            <span key={s} style={{ '--i': i } as Vars}>
              {s}
            </span>
          ))}
        </div>
      )
    case 'speak':
      return (
        <div className="speak">
          <span className="speak-q">{text.speakQ ?? 'What do you do in your free time?'}</span>
          <span className="speak-a">
            <i />
            <i />
            <i />
          </span>
        </div>
      )
    case 'chart':
      return (
        <svg className="chart" viewBox="0 0 220 110">
          <path className="chart-axis" d="M14 8 V96 H212" />
          <path className="chart-line" pathLength={1} d="M18 80 L58 64 L98 70 L138 40 L178 30 L208 18" />
          <path className="chart-line chart-line--2" pathLength={1} d="M18 60 L58 66 L98 52 L138 58 L178 72 L208 76" />
        </svg>
      )
    case 'essay':
      return (
        <div className="essay">
          {['Mở bài', 'Thân bài 1', 'Thân bài 2', 'Kết bài'].map((s, i) => (
            <span key={s} style={{ '--i': i } as Vars}>
              {s}
            </span>
          ))}
        </div>
      )
  }
}

export function DayArt({ arts, text }: { arts: ArtKey[]; text?: ArtText }) {
  return (
    <div className="art" aria-hidden="true">
      {arts.map((k) => (
        <ArtPiece key={k} k={k} text={text} />
      ))}
    </div>
  )
}

/** Kiểm tra định kỳ: các ô bài học, hết mỗi nhóm là một con dấu TEST rơi xuống. sizes = số unit trước mỗi bài test.
 *  breakAfter: sau nhóm thứ mấy thì sang kỳ mới (vd Nền Tảng: Kỳ 1 có 4 nhóm × 3 unit, Kỳ 2 có 2 nhóm × 4 unit). */
export function TestTiles({
  sizes,
  unitWord,
  testWord,
  breakAfter,
  breakLabel,
}: {
  sizes: number[]
  unitWord: string
  testWord: string
  breakAfter?: number
  breakLabel?: string
}) {
  const total = sizes.reduce((a, b) => a + b, 0)
  let u = 0
  return (
    <div className="tiles" role="img" aria-label={`${total} ${unitWord.toLowerCase()}, ${sizes.length} bài kiểm tra định kỳ, mỗi bài sau ${[...new Set(sizes)].join(' hoặc ')} ${unitWord.toLowerCase()}.`}>
      {sizes.map((n, gi) => {
        const g = gi + 1
        const cells = Array.from({ length: n }, () => ++u)
        return (
          <div className={`tiles-group${breakAfter && gi === breakAfter ? ' tiles-group--break' : ''}`} key={g} style={{ '--n': n + 1 } as Vars} data-break={breakAfter && gi === breakAfter ? breakLabel : undefined}>
            {cells.map((c) => (
              <span className="tile" key={c}>
                {unitWord} {c}
              </span>
            ))}
            <span className="tile-test" style={{ '--k': g } as Vars}>
              {testWord} {g}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Phiếu báo cáo tháng (minh hoạ, không có số liệu giả), từng dòng được tick dần. */
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

/** Cảnh của video trang học (giây bắt đầu), dùng cho danh sách tính năng bấm-là-tua (chương "Trang học riêng"). */
export const WEB_SCENES: Record<string, number> = { writing: 0.2, speak: 6.3, quiz: 10.3, vocab: 14.3, phone: 18.2 }
