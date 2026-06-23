'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WritingFeedbackItem {
  wordCount: number
  hasEnoughWords: boolean
  vocabLevel: string
  grammarNote: string
}

interface TestResult {
  success: boolean
  suggestedClass: string
  specialNotice: string | null
  levelFeedback: { headline: string; detail: string }
  writingFeedback: {
    task1: WritingFeedbackItem | null
    task2: WritingFeedbackItem | null
  }
}

const CLASS_STYLE: Record<string, {
  wrapperBg: string; wrapperBorder: string;
  headingColor: string; bodyColor: string;
  badgeBg: string; badgeText: string;
}> = {
  'IELTS Nền Tảng (Trình độ 3-4)': {
    wrapperBg: '#E1F5EE', wrapperBorder: '#5DCAA5',
    headingColor: '#0B3D5C', bodyColor: '#2C2C2A',
    badgeBg: '#1D9E75', badgeText: '#fff',
  },
  'IELTS Căn Bản (Trình độ 4-5)': {
    wrapperBg: '#f0faf6', wrapperBorder: '#1D9E75',
    headingColor: '#0B3D5C', bodyColor: '#2C2C2A',
    badgeBg: '#0B3D5C', badgeText: '#fff',
  },
  'Complete IELTS (Trình độ 5-6+)': {
    wrapperBg: '#0B3D5C', wrapperBorder: '#EF9F27',
    headingColor: '#fff', bodyColor: 'rgba(255,255,255,0.75)',
    badgeBg: '#EF9F27', badgeText: '#2C2C2A',
  },
}

const CLASS_DESC: Record<string, string> = {
  'IELTS Nền Tảng (Trình độ 3-4)': 'Xây dựng từ vựng, ngữ pháp và phát âm nền tảng trước khi vào IELTS chuyên sâu. Phù hợp với học viên chưa có nền tảng IELTS.',
  'IELTS Căn Bản (Trình độ 4-5)': 'Củng cố ngữ pháp và từ vựng, làm quen 4 kỹ năng IELTS. Phù hợp với học viên đã có kiến thức cơ bản và muốn đạt Band 4.5–5.0.',
  'Complete IELTS (Trình độ 5-6+)': 'Luyện đề thật và nâng cao 4 kỹ năng theo chuẩn IELTS. Phù hợp với học viên có nền tảng ổn và đang nhắm Band 5.5–6.5+.',
}

function WritingCard({ label, feedback }: { label: string; feedback: WritingFeedbackItem }) {
  const minWords = label.includes('Task 1') ? 150 : 250
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--off-white)', border: '1px solid var(--mint)' }}>
      <h4 className="font-sans font-semibold text-sm mb-3" style={{ color: 'var(--navy)' }}>{label}</h4>
      <div className="space-y-2.5">
        {/* Word count */}
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 font-mono"
            style={feedback.hasEnoughWords
              ? { background: '#E1F5EE', color: '#1D9E75' }
              : { background: '#FEF3C7', color: '#92400E' }}>
            {feedback.hasEnoughWords ? '✓' : '!'}
          </span>
          <span className="text-sm font-sans" style={{ color: 'var(--ink)' }}>
            <span className="font-semibold">Độ dài:</span>{' '}
            <span className="font-mono font-bold" style={{ color: 'var(--amber)' }}>{feedback.wordCount}</span> từ
            {feedback.hasEnoughWords
              ? ' — đã đủ yêu cầu'
              : ` — cần thêm ${minWords - feedback.wordCount} từ`}
          </span>
        </div>
        {/* Vocabulary */}
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 font-sans"
            style={{ background: '#E1F5EE', color: '#0B3D5C' }}>V</span>
          <span className="text-sm font-sans" style={{ color: 'var(--ink)' }}>
            <span className="font-semibold">Từ vựng:</span> {feedback.vocabLevel}
          </span>
        </div>
        {/* Grammar */}
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 font-sans"
            style={{ background: '#0B3D5C', color: '#fff' }}>G</span>
          <span className="text-sm font-sans" style={{ color: 'var(--ink)' }}>
            <span className="font-semibold">Ngữ pháp:</span> {feedback.grammarNote}
          </span>
        </div>
      </div>
    </div>
  )
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '19:00', '20:00', '21:00',
]

function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function ResultPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [studentName, setStudentName] = useState('')

  // Callback scheduling state
  const [callbackDate, setCallbackDate] = useState('')
  const [callbackTime, setCallbackTime] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [scheduleError, setScheduleError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('testResult')
    if (raw) {
      setResult(JSON.parse(raw))
      sessionStorage.removeItem('testResult')
    }
    const info = sessionStorage.getItem('studentInfo')
    if (info) {
      try { setStudentName(JSON.parse(info).studentName || '') } catch {}
    }
  }, [])

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault()
    if (!callbackDate || !callbackTime) return
    setScheduling(true)
    setScheduleError('')
    try {
      const formatted = `${callbackDate} ${callbackTime}`
      const res = await fetch('/api/schedule-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, callbackDate: formatted }),
      })
      if (!res.ok) throw new Error()
      setScheduled(true)
    } catch {
      setScheduleError('Không thể lưu lịch. Vui lòng thử lại.')
    } finally {
      setScheduling(false)
    }
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--off-white)' }}>
        <div className="text-center">
          <p className="font-sans mb-4" style={{ color: 'var(--ink)', opacity: 0.6 }}>Không tìm thấy kết quả bài test.</p>
          <Link href="/" className="font-sans text-sm font-medium" style={{ color: 'var(--teal)' }}>← Về trang chủ</Link>
        </div>
      </main>
    )
  }

  const cs = CLASS_STYLE[result.suggestedClass] || CLASS_STYLE['IELTS Căn Bản (Trình độ 4-5)']
  const classDesc = CLASS_DESC[result.suggestedClass] || ''
  const hasWriting = result.writingFeedback?.task1 || result.writingFeedback?.task2

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--off-white)' }}>
      <div className="max-w-lg mx-auto space-y-5">

        {/* Success header */}
        <div className="text-center mb-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{ background: '#E1F5EE' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#1D9E75" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-2xl mb-1" style={{ color: 'var(--navy)' }}>
            Thầy Long đã nhận được bài!
          </h1>
          <p className="font-sans text-sm" style={{ color: 'var(--ink)', opacity: 0.6 }}>
            Dưới đây là nhận xét sơ bộ về kết quả của bạn.
          </p>
        </div>

        {/* Level feedback */}
        {result.levelFeedback && (
          <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(11,61,92,0.08)' }}>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
               style={{ color: 'var(--teal)' }}>Trình độ hiện tại</p>
            <h2 className="font-serif font-bold text-xl mb-2" style={{ color: 'var(--navy)' }}>
              {result.levelFeedback.headline}
            </h2>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)', opacity: 0.75 }}>
              {result.levelFeedback.detail}
            </p>
          </div>
        )}

        {/* Suggested class */}
        <div className="rounded-2xl p-5" style={{
          background: cs.wrapperBg,
          border: `1.5px solid ${cs.wrapperBorder}`,
          boxShadow: '0 2px 12px rgba(11,61,92,0.10)',
        }}>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
             style={{ color: cs.wrapperBg === '#0B3D5C' ? 'var(--teal-light)' : 'var(--teal)' }}>
            Lớp phù hợp
          </p>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold font-sans mb-3"
                style={{ background: cs.badgeBg, color: cs.badgeText }}>
            Đề xuất của thầy Long
          </span>
          <h3 className="font-serif font-bold text-lg mb-1" style={{ color: cs.headingColor }}>
            {result.suggestedClass}
          </h3>
          <p className="font-sans text-sm leading-relaxed" style={{ color: cs.bodyColor }}>
            {classDesc}
          </p>

          {result.specialNotice && (
            <div className="mt-4 rounded-xl p-3" style={{ background: '#FEF3C7', border: '1px solid #EF9F27' }}>
              <p className="font-sans text-xs leading-relaxed" style={{ color: '#92400E' }}>
                <span className="font-semibold">⚠️ Lưu ý:</span>{' '}
                Năng lực thực tế của bạn phù hợp với lớp Nền Tảng (3–4), nhưng do thời gian thi gấp, thầy đề xuất lớp Căn Bản để đẩy nhanh tiến độ.
              </p>
            </div>
          )}
        </div>

        {/* Writing feedback */}
        {hasWriting && (
          <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(11,61,92,0.08)' }}>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
               style={{ color: 'var(--teal)' }}>Nhận xét Writing</p>
            <div className="space-y-3">
              {result.writingFeedback.task1 && (
                <WritingCard label="Writing Task 1" feedback={result.writingFeedback.task1} />
              )}
              {result.writingFeedback.task2 && (
                <WritingCard label="Writing Task 2" feedback={result.writingFeedback.task2} />
              )}
            </div>
            <p className="font-sans text-xs italic mt-3" style={{ color: 'var(--ink)', opacity: 0.45 }}>
              Nhận xét mang tính tham khảo chung. Thầy Long sẽ chấm bài chi tiết hơn sau khi xem xét toàn bộ bài làm.
            </p>
          </div>
        )}

        {/* Next steps */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--mint)', border: '1px solid #5DCAA5' }}>
          <h2 className="font-sans font-semibold mb-3" style={{ color: 'var(--navy)' }}>Bước tiếp theo</h2>
          <ul className="space-y-2.5">
            <li className="flex gap-2.5">
              <span className="shrink-0 font-mono font-bold text-sm mt-0.5" style={{ color: 'var(--teal)' }}>01</span>
              <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--navy)' }}>
                Thầy Long sẽ gọi điện hoặc nhắn Zalo để tư vấn và sắp xếp buổi học thử trong <strong>24 giờ</strong>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 font-mono font-bold text-sm mt-0.5" style={{ color: 'var(--teal)' }}>02</span>
              <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--navy)' }}>
                Sắp xếp <strong>2 buổi học thử miễn phí</strong> để trải nghiệm trực tiếp cách dạy của thầy.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 font-mono font-bold text-sm mt-0.5" style={{ color: 'var(--teal)' }}>03</span>
              <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--navy)' }}>
                Nhận lộ trình học cá nhân hóa phù hợp với mục tiêu và trình độ của bạn.
              </span>
            </li>
          </ul>
        </div>

        {/* Callback scheduling */}
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(11,61,92,0.08)' }}>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
             style={{ color: 'var(--teal)' }}>Đặt lịch tư vấn</p>
          <h2 className="font-serif font-bold text-lg mb-1" style={{ color: 'var(--navy)' }}>
            Chọn thời gian để thầy Long gọi cho bạn
          </h2>
          <p className="font-sans text-sm mb-4" style={{ color: 'var(--ink)', opacity: 0.65 }}>
            Thầy sẽ liên hệ qua Zalo hoặc điện thoại đúng khung giờ bạn chọn.
          </p>

          {scheduled ? (
            <div className="rounded-xl p-4 flex items-start gap-3"
                 style={{ background: '#E1F5EE', border: '1px solid #5DCAA5' }}>
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                   stroke="#1D9E75" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-sans font-semibold text-sm" style={{ color: 'var(--navy)' }}>
                  Đã ghi nhận lịch!
                </p>
                <p className="font-sans text-sm" style={{ color: 'var(--ink)', opacity: 0.75 }}>
                  Thầy Long sẽ liên hệ bạn vào{' '}
                  <span className="font-semibold font-mono" style={{ color: 'var(--teal)' }}>
                    {callbackTime} ngày {callbackDate.split('-').reverse().join('/')}
                  </span>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSchedule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-xs font-semibold block mb-1"
                         style={{ color: 'var(--navy)' }}>Ngày</label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={callbackDate}
                    onChange={e => setCallbackDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 font-sans text-sm outline-none"
                    style={{
                      border: '1.5px solid #5DCAA5',
                      color: 'var(--navy)',
                      background: 'var(--off-white)',
                    }}
                  />
                </div>
                <div>
                  <label className="font-sans text-xs font-semibold block mb-1"
                         style={{ color: 'var(--navy)' }}>Giờ</label>
                  <select
                    required
                    value={callbackTime}
                    onChange={e => setCallbackTime(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 font-sans text-sm outline-none"
                    style={{
                      border: '1.5px solid #5DCAA5',
                      color: callbackTime ? 'var(--navy)' : '#9ca3af',
                      background: 'var(--off-white)',
                    }}
                  >
                    <option value="">-- Chọn giờ --</option>
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {scheduleError && (
                <p className="font-sans text-xs" style={{ color: '#92400E' }}>{scheduleError}</p>
              )}

              <button
                type="submit"
                disabled={scheduling || !callbackDate || !callbackTime}
                className="w-full py-3 rounded-xl font-sans font-semibold text-sm text-white transition-opacity"
                style={{
                  background: 'var(--teal)',
                  opacity: (scheduling || !callbackDate || !callbackTime) ? 0.45 : 1,
                }}
              >
                {scheduling ? 'Đang lưu...' : 'Xác nhận lịch tư vấn'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="font-sans text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--teal)' }}>
            ← Về trang chủ
          </Link>
        </div>

      </div>
    </main>
  )
}
