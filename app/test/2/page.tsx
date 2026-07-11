'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PromiseResubmit } from '@/components/ui/promise-resubmit'
import { ReadingListeningExercise } from '@/components/test-exercise/ReadingListeningExercise'
import { TEST2_SECTIONS, type TestSection } from '@/lib/test2-content'

interface StudentInfo {
  studentName: string
  studentPhone: string
  suggestedClass: string
  testLevel: number
}

const WRITING_PROMPT =
  'Some people think the government should invest more in teaching science than other subjects to help a country develop and progress. Do you agree or disagree with this opinion?'

const EXERCISE_CARDS: { id: TestSection['id']; icon: string; title: string; shortLabel: string; accent: string }[] = [
  { id: 'reading', icon: '📖', title: 'Reading — Tribal tourism', shortLabel: 'Reading', accent: 'blue' },
  { id: 'listeningS1', icon: '🎧', title: 'Listening Section 1', shortLabel: 'Listening 1', accent: 'green' },
  { id: 'listeningS2', icon: '🎧', title: 'Listening Section 2', shortLabel: 'Listening 2', accent: 'green' },
]

const EXERCISE_ORDER: TestSection['id'][] = ['reading', 'listeningS1', 'listeningS2']

function getNextExerciseId(current: TestSection['id']): TestSection['id'] | null {
  const idx = EXERCISE_ORDER.indexOf(current)
  return idx >= 0 && idx < EXERCISE_ORDER.length - 1 ? EXERCISE_ORDER[idx + 1] : null
}

export default function Test2Page() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [scores, setScores] = useState<Record<TestSection['id'], { score: number; total: number } | null>>({
    reading: null,
    listeningS1: null,
    listeningS2: null,
  })
  const [activeExerciseId, setActiveExerciseId] = useState<TestSection['id'] | null>(null)
  const [writingTask2, setWritingTask2] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo')
    if (info) setStudent(JSON.parse(info))
  }, [])

  const readingScore = scores.reading ? `${scores.reading.score}/${scores.reading.total}` : ''
  const listeningS1 = scores.listeningS1 ? `${scores.listeningS1.score}/${scores.listeningS1.total}` : ''
  const listeningS2 = scores.listeningS2 ? `${scores.listeningS2.score}/${scores.listeningS2.total}` : ''

  const nextExerciseId = activeExerciseId ? getNextExerciseId(activeExerciseId) : null

  const wordCount = writingTask2.trim() ? writingTask2.trim().split(/\s+/).length : 0

  const missingParts: string[] = []
  if (!writingTask2.trim()) missingParts.push('Writing Task 2')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student?.studentName || '',
          studentPhone: student?.studentPhone || '',
          testLevel: 2,
          readingScore,
          listeningS1,
          listeningS2,
          writingTask2,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      sessionStorage.setItem('testResult', JSON.stringify(data))
      router.push('/result')
    } catch {
      setError('Lỗi khi nộp bài. Vui lòng thử lại.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--off-white)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-xs font-semibold font-sans px-3 py-1 rounded-full mb-3"
                style={{ background: 'var(--mint)', color: 'var(--navy)' }}>
            Test 2 — Trình độ Trung bình (5.0–6.0)
          </span>
          <h1 className="font-serif font-bold text-2xl mb-2" style={{ color: 'var(--navy)' }}>Bài kiểm tra Reading, Listening & Writing</h1>
          {student && (
            <p className="text-gray-500 text-sm">
              Xin chào <strong>{student.studentName}</strong>! Bài test này gồm 3 phần, dành khoảng 60 phút.
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-3">Hướng dẫn làm bài</h2>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Bấm vào từng thẻ Reading/Listening bên dưới để làm bài ngay trên trang này.</li>
            <li>Làm xong bấm &quot;Hoàn thành&quot; — hệ thống tự chấm điểm, không cần tự ghi.</li>
            <li>Viết bài Writing Task 2 trực tiếp vào ô bên dưới (tối thiểu 250 từ).</li>
            <li>Điền đầy đủ rồi bấm Nộp bài. Có thể quay lại làm tiếp bất cứ lúc nào.</li>
          </ol>
        </div>

        {/* Exercise cards */}
        <div className="space-y-3 mb-8">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Phần 1 & 2 — Đọc & Nghe</h2>
          {EXERCISE_CARDS.map((card) => {
            const result = scores[card.id]
            const section = TEST2_SECTIONS[card.id]
            const borderColor = card.accent === 'blue' ? 'border-blue-200 hover:border-blue-400' : 'border-green-200 hover:border-green-400'
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveExerciseId(card.id)}
                className={`w-full flex items-center gap-4 bg-white border-2 ${borderColor} rounded-xl p-4 transition-colors group text-left`}
              >
                <span className="text-2xl">{card.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 transition-colors">
                    {card.title} <span className="text-gray-400 font-normal text-xs">— {section.timeLabel}</span>
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {result ? `Đã hoàn thành: ${result.score}/${result.total} câu đúng` : 'Chưa làm'}
                  </p>
                </div>
                <span
                  className="text-sm font-medium shrink-0"
                  style={{ color: result ? 'var(--teal)' : card.accent === 'blue' ? '#3B82F6' : '#22C55E' }}
                >
                  {result ? 'Làm lại →' : 'Bắt đầu →'}
                </span>
              </button>
            )
          })}
        </div>

        {activeExerciseId && (
          <ReadingListeningExercise
            key={activeExerciseId}
            section={TEST2_SECTIONS[activeExerciseId]}
            nextSection={
              nextExerciseId
                ? { id: nextExerciseId, label: EXERCISE_CARDS.find((c) => c.id === nextExerciseId)!.shortLabel }
                : null
            }
            onComplete={(score, total) => {
              setScores((prev) => ({ ...prev, [activeExerciseId]: { score, total } }))
            }}
            onGoToNext={(id) => setActiveExerciseId(id)}
            onClose={() => setActiveExerciseId(null)}
          />
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Điểm Reading & Listening (tự động)</h2>

          <div className="grid grid-cols-3 gap-3">
            {EXERCISE_CARDS.map((card) => {
              const result = scores[card.id]
              return (
                <div key={card.id} className="rounded-lg border border-gray-200 p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{card.title.split(' — ')[0]}</p>
                  <p className="font-mono font-semibold text-lg" style={{ color: result ? 'var(--teal)' : '#D1D5DB' }}>
                    {result ? `${result.score}/${result.total}` : '—'}
                  </p>
                </div>
              )
            })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Task 2{' '}
              <span className="text-gray-400 font-normal">(tối thiểu 250 từ)</span>
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-600 italic">
              {WRITING_PROMPT}
            </div>
            <textarea
              value={writingTask2}
              onChange={(e) => setWritingTask2(e.target.value)}
              rows={10}
              placeholder="Viết bài của bạn ở đây..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className={`text-right text-xs mt-1 ${wordCount >= 250 ? 'text-green-600' : 'text-gray-400'}`}>
              {wordCount} từ {wordCount >= 250 ? '✓' : '(cần thêm ' + (250 - wordCount) + ' từ)'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || missingParts.length > 0}
            className="w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold font-sans py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài cho Thầy Long'}
          </button>
          {missingParts.length > 0 && (
            <p className="text-center text-red-500 text-xs font-medium">
              Cần hoàn thành trước khi nộp: {missingParts.join(', ')}
            </p>
          )}
          <p className="text-center text-gray-400 text-xs">
            Bạn có thể quay lại trang này bất cứ lúc nào để hoàn thành và nộp.
          </p>
        </form>
        <PromiseResubmit raised={!!activeExerciseId} />
      </div>
    </main>
  )
}
