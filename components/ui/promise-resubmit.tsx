'use client'

import { useState, useEffect } from 'react'

function getMinDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function formatForSheet(date: string): string {
  const [, month, day] = date.split('-')
  return `${parseInt(day)}/${parseInt(month)}`
}

interface PromiseResubmitProps {
  /** true khi đang mở 1 bài Reading/Listening — icon thu nhỏ cần nhích lên để không đè thanh nút dưới cùng */
  raised?: boolean
}

export function PromiseResubmit({ raised = false }: PromiseResubmitProps) {
  const [studentName, setStudentName] = useState('')
  const [phase, setPhase] = useState<'hidden' | 'icon' | 'modal'>('hidden')
  const [promiseDate, setPromiseDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const info = sessionStorage.getItem('studentInfo')
      if (info) setStudentName(JSON.parse(info).studentName || '')
    } catch {}
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase((current) => (current === 'hidden' ? 'modal' : current))
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!promiseDate) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/schedule-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          callbackDate: formatForSheet(promiseDate),
          status: 'Đang tư vấn',
          insertIfMissing: true,
        }),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch {
      setError('Không thể lưu hẹn. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const [d, m] = promiseDate
    ? [parseInt(promiseDate.split('-')[2]), parseInt(promiseDate.split('-')[1])]
    : [0, 0]

  if (phase === 'hidden') return null

  return (
    <>
      {/* Minimised icon — always mounted once ready, sits below the modal */}
      <button
        type="button"
        onClick={() => setPhase('modal')}
        aria-label="Hẹn ngày nộp kết quả"
        className="fixed z-[90] flex items-center justify-center rounded-full transition-transform hover:scale-105"
        style={{
          right: '20px',
          bottom: raised ? '92px' : '20px',
          width: '56px',
          height: '56px',
          background: 'var(--navy)',
          border: '2px solid var(--teal)',
          boxShadow: '0 8px 24px rgba(11,61,92,0.35)',
        }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Big centered popup */}
      {phase === 'modal' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(11,61,92,0.45)' }}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 24px 64px rgba(11,61,92,0.4)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5" style={{ background: 'var(--navy)' }}>
              <div>
                <p className="font-serif font-bold text-xl" style={{ color: '#fff' }}>
                  Chưa làm được ngay?
                </p>
                <p className="font-sans text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Hẹn ngày nộp kết quả — thầy Long sẽ nhắc nếu chưa thấy bài
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhase('icon')}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-3 mt-0.5 transition-opacity hover:opacity-70"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {saved ? (
                <div
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: '#E1F5EE', border: '1px solid #5DCAA5' }}
                >
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#1D9E75" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-sans font-semibold text-base" style={{ color: 'var(--navy)' }}>
                      Đã ghi nhận!
                    </p>
                    <p className="font-sans text-sm mt-1" style={{ color: 'var(--ink)', opacity: 0.75 }}>
                      Thầy Long chờ bài vào ngày{' '}
                      <span className="font-mono font-semibold" style={{ color: 'var(--teal)' }}>
                        {d}/{m}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setPhase('icon')}
                      className="mt-3 text-sm font-semibold font-sans underline"
                      style={{ color: 'var(--navy)' }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-sans text-sm font-semibold block mb-1.5" style={{ color: 'var(--navy)' }}>
                      Ngày hẹn nộp bài
                    </label>
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={promiseDate}
                      onChange={(e) => setPromiseDate(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-sans text-base outline-none"
                      style={{
                        border: '1.5px solid #5DCAA5',
                        color: 'var(--navy)',
                        background: 'var(--off-white)',
                      }}
                    />
                  </div>

                  {error && (
                    <p className="font-sans text-sm" style={{ color: '#92400E' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving || !promiseDate}
                    className="w-full py-3.5 rounded-xl font-sans font-semibold text-base text-white transition-opacity"
                    style={{
                      background: 'var(--teal)',
                      opacity: saving || !promiseDate ? 0.4 : 1,
                    }}
                  >
                    {saving ? 'Đang lưu...' : 'Xác nhận hẹn nộp bài'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase('icon')}
                    className="w-full text-center text-sm font-sans"
                    style={{ color: 'var(--ink)', opacity: 0.6 }}
                  >
                    Để sau
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
