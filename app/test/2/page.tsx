'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PromiseResubmit } from '@/components/ui/promise-resubmit'

interface StudentInfo {
  studentName: string
  studentPhone: string
  suggestedClass: string
  testLevel: number
}

const WRITING_PROMPT =
  'Some people think the government should invest more in teaching science than other subjects to help a country develop and progress. Do you agree or disagree with this opinion?'

export default function Test2Page() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [readingScore, setReadingScore] = useState('')
  const [listeningS1, setListeningS1] = useState('')
  const [listeningS2, setListeningS2] = useState('')
  const [writingTask2, setWritingTask2] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo')
    if (info) setStudent(JSON.parse(info))
  }, [])

  const wordCount = writingTask2.trim() ? writingTask2.trim().split(/\s+/).length : 0

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
            <li>Nên làm bằng máy tính để đảm bảo chất lượng tốt nhất.</li>
            <li>Bấm vào link Reading và Listening, làm bài xong rồi ghi lại điểm.</li>
            <li>Viết bài Writing Task 2 trực tiếp vào ô bên dưới (tối thiểu 250 từ).</li>
            <li>Điền đầy đủ rồi bấm Nộp bài.</li>
          </ol>
        </div>

        {/* Test Links */}
        <div className="space-y-3 mb-8">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Phần 1 & 2 — Đọc & Nghe</h2>
          <a
            href="https://e-learning.youpass.vn/practice/reading/1529"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-colors group"
          >
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                Reading — 20 phút
              </h3>
              <p className="text-gray-500 text-xs">YouPass IELTS Practice · Ghi lại điểm sau khi xong</p>
            </div>
            <span className="text-blue-500 text-sm font-medium">Mở →</span>
          </a>
          <a
            href="https://e-learning.youpass.vn/practice/listening/9705"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-4 transition-colors group"
          >
            <span className="text-2xl">🎧</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                Listening Section 1 — 15 phút
              </h3>
              <p className="text-gray-500 text-xs">YouPass IELTS Practice</p>
            </div>
            <span className="text-green-500 text-sm font-medium">Mở →</span>
          </a>
          <a
            href="https://e-learning.youpass.vn/practice/listening/8422"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-4 transition-colors group"
          >
            <span className="text-2xl">🎧</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                Listening Section 2 — 15 phút
              </h3>
              <p className="text-gray-500 text-xs">YouPass IELTS Practice</p>
            </div>
            <span className="text-green-500 text-sm font-medium">Mở →</span>
          </a>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Điền kết quả & nộp bài</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm Reading</label>
              <input
                type="text"
                value={readingScore}
                onChange={(e) => setReadingScore(e.target.value)}
                placeholder="VD: 9/13"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listening Section 1</label>
              <input
                type="text"
                value={listeningS1}
                onChange={(e) => setListeningS1(e.target.value)}
                placeholder="VD: 8/10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listening Section 2</label>
              <input
                type="text"
                value={listeningS2}
                onChange={(e) => setListeningS2(e.target.value)}
                placeholder="VD: 7/10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
            disabled={submitting}
            className="w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold font-sans py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài cho Thầy Long'}
          </button>
          <p className="text-center text-gray-400 text-xs">
            Bạn có thể quay lại trang này bất cứ lúc nào để hoàn thành và nộp.
          </p>
        </form>
        <PromiseResubmit />
      </div>
    </main>
  )
}
