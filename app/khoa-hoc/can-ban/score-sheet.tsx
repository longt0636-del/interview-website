import { founder } from '@/lib/brochure-can-ban'

// Phiếu điểm IELTS của thầy Long dựng bằng chữ thật (không phải ảnh chụp, không có số báo danh / ngày sinh).
// Trên web: mỗi ô điểm được "đóng dấu" khi cuộn tới ngưỡng data-stamp-at, rồi nét bút cam khoanh ô Overall (motion.tsx).
// Không có JS, bản in, hoặc máy bật giảm chuyển động: mọi dấu đã đóng sẵn, vòng khoanh đã vẽ xong.
const THRESHOLDS = ['0.06', '0.18', '0.30', '0.42']

export function ScoreSheet({ className = '' }: { className?: string }) {
  const label = `Kết quả IELTS Academic của ${founder.name.replace('Thầy ', 'thầy ')}, thi ngày ${founder.testDate}: ${founder.scores
    .map((s) => `${s.k} ${s.v}`)
    .join(', ')}, Overall ${founder.overall}.`
  return (
    <figure className={`trf ${className}`} aria-label={label}>
      <span className="tape tape--trf" aria-hidden="true" />
      <div className="trf-top" aria-hidden="true">
        <span className="trf-logo">IELTS</span>
        <span className="trf-kind">Kết quả · Academic</span>
      </div>
      <dl className="trf-meta" aria-hidden="true">
        <div>
          <dt>Thí sinh</dt>
          <dd>TRAN NHAT LONG</dd>
        </div>
        <div>
          <dt>Ngày thi</dt>
          <dd>{founder.testDate}</dd>
        </div>
      </dl>
      <div className="trf-grid" aria-hidden="true">
        {founder.scores.map((s, i) => (
          <div className="trf-cell" key={s.k}>
            <span className="trf-k">{s.k}</span>
            <span className="stamp" data-stamp-at={THRESHOLDS[i]}>
              {s.v}
            </span>
          </div>
        ))}
      </div>
      <div className="trf-overall" aria-hidden="true">
        <span className="trf-k">Overall Band Score</span>
        <span className="trf-overall-v">
          <span className="stamp stamp--big" data-stamp-at="0.54">
            {founder.overall}
          </span>
          <svg className="score-ring" viewBox="0 0 220 120" preserveAspectRatio="none" focusable="false">
            <path
              data-ring
              pathLength={1}
              d="M118 10 C 62 6, 14 26, 12 60 C 10 96, 70 114, 122 110 C 178 106, 210 84, 206 54 C 202 22, 150 6, 96 14"
            />
          </svg>
        </span>
      </div>
    </figure>
  )
}
