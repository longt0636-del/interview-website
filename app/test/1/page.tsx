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

export default function Test1Page() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [grammarScore, setGrammarScore] = useState('')
  const [vocabScore, setVocabScore] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo')
    if (info) setStudent(JSON.parse(info))
  }, [])

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
          testLevel: 1,
          grammarScore,
          vocabScore,
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
            Test 1 — Trình độ Cơ bản / Mất gốc
          </span>
          <h1 className="font-serif font-bold text-2xl mb-2" style={{ color: 'var(--navy)' }}>Bài kiểm tra Grammar & Vocabulary</h1>
          {student && (
            <p className="text-gray-500 text-sm">
              Xin chào <strong>{student.studentName}</strong>! Đây là bài test phù hợp với trình độ của bạn.
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-3">Hướng dẫn làm bài</h2>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Bấm vào từng link bên dưới để làm bài test trên website Oxford.</li>
            <li>Làm bài theo tốc độ của bạn — không cần vội.</li>
            <li>Sau khi xong mỗi bài, ghi lại điểm số hiển thị.</li>
            <li>Điền điểm vào form bên dưới và bấm Nộp bài.</li>
          </ol>
        </div>

        {/* Test Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <a
            href="https://www.oxfordonlineenglish.com/english-level-test/grammar"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Bài test Grammar
                </h3>
                <p className="text-gray-500 text-xs mt-1">Oxford Online English · ~15 phút</p>
                <p className="text-blue-600 text-xs mt-2 font-medium">Bấm để mở bài test →</p>
              </div>
            </div>
          </a>
          <a
            href="https://www.oxfordonlineenglish.com/english-level-test/vocabulary"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border-2 border-purple-200 hover:border-purple-400 rounded-xl p-5 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  Bài test Vocabulary
                </h3>
                <p className="text-gray-500 text-xs mt-1">Oxford Online English · ~15 phút</p>
                <p className="text-purple-600 text-xs mt-2 font-medium">Bấm để mở bài test →</p>
              </div>
            </div>
          </a>
        </div>

        {/* Score Submission */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Điền kết quả sau khi làm xong</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm Grammar (tổng 40 câu)
              </label>
              <input
                type="text"
                value={grammarScore}
                onChange={(e) => setGrammarScore(e.target.value)}
                placeholder="VD: 28/40"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm Vocabulary (tổng 40 câu)
              </label>
              <input
                type="text"
                value={vocabScore}
                onChange={(e) => setVocabScore(e.target.value)}
                placeholder="VD: 22/40"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || (!grammarScore && !vocabScore)}
            className="w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold font-sans py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài cho Thầy Long'}
          </button>
          <p className="text-center text-gray-400 text-xs">
            Bạn có thể quay lại trang này bất cứ lúc nào để nộp bài.
          </p>
        </form>
        <PromiseResubmit />
      </div>
    </main>
  )
}
