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

export function PromiseResubmit() {
  const [studentName, setStudentName] = useState('')
  const [open, setOpen] = useState(false)
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

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        width: '300px',
      }}
    >
      {/* Minimised pill */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-left"
          style={{
            background: 'var(--navy)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(11,61,92,0.30)',
            border: '2px solid var(--teal)',
            cursor: 'pointer',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm" style={{ color: '#fff' }}>
                Chưa làm được ngay?
              </p>
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Hẹn ngày nộp kết quả cho thầy Long
              </p>
            </div>
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-3"
              style={{ background: 'var(--teal)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                   stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Expanded card */}
      {open && (
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 12px 48px rgba(11,61,92,0.25)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between px-5 py-4"
            style={{ background: 'var(--navy)' }}
          >
            <div>
              <p className="font-sans font-bold text-sm" style={{ color: '#fff' }}>
                Hẹn ngày nộp kết quả
              </p>
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Thầy Long sẽ nhắc nếu chưa thấy bài
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-2 mt-0.5 transition-opacity hover:opacity-70"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                   stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {saved ? (
              <div className="rounded-xl p-3.5 flex items-start gap-2.5"
                   style={{ background: '#E1F5EE', border: '1px solid #5DCAA5' }}>
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                     stroke="#1D9E75" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-sans font-semibold text-sm" style={{ color: 'var(--navy)' }}>
                    Đã ghi nhận!
                  </p>
                  <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink)', opacity: 0.75 }}>
                    Thầy Long chờ bài vào ngày{' '}
                    <span className="font-mono font-semibold" style={{ color: 'var(--teal)' }}>
                      {d}/{m}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="font-sans text-xs font-semibold block mb-1"
                         style={{ color: 'var(--navy)' }}>Ngày hẹn nộp bài</label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={promiseDate}
                    onChange={e => setPromiseDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 font-sans text-sm outline-none"
                    style={{
                      border: '1.5px solid #5DCAA5',
                      color: 'var(--navy)',
                      background: 'var(--off-white)',
                    }}
                  />
                </div>

                {error && (
                  <p className="font-sans text-xs" style={{ color: '#92400E' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={saving || !promiseDate}
                  className="w-full py-3 rounded-xl font-sans font-semibold text-sm text-white transition-opacity"
                  style={{
                    background: 'var(--teal)',
                    opacity: (saving || !promiseDate) ? 0.4 : 1,
                  }}
                >
                  {saving ? 'Đang lưu...' : 'Xác nhận hẹn nộp bài'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
