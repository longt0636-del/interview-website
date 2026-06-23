'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PromiseResubmit } from '@/components/ui/promise-resubmit'

interface StudentInfo {
  studentName: string
  studentPhone: string
  suggestedClass: string
  testLevel: number
}

const WRITING_TASK1_PROMPT =
  'The graph below shows the amounts of waste produced by three companies over a period of 15 years. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'

const WRITING_TASK2_PROMPT =
  'Some people think the government should invest more in teaching science than other subjects to help a country develop and progress. To what extent do you agree or disagree?'

const SPEAKING_PART1 = [
  'Which town or city do you live in now?',
  'Are there any things you don\'t like about your area? (What are they?)',
  'Do you think you will continue to live there for a long time? (Why? Why not?)',
  'What are some changes in the area recently?',
]

const SPEAKING_PART2 =
  'Describe a place where you would like to learn about the culture.\nYou should say:\n• What the place is\n• Where it is\n• What would you like to learn there\n• And explain why you would like to learn about the culture there'

const SPEAKING_PART3 = [
  'How does the Internet affect culture?',
  'What kind of culture is popular among the young?',
  'Are young people in Vietnam interested in cultural knowledge?',
]

export default function Test3Page() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [readingScore, setReadingScore] = useState('')
  const [listeningScore, setListeningScore] = useState('')
  const [writingTask1, setWritingTask1] = useState('')
  const [writingTask2, setWritingTask2] = useState('')
  const [recordingFile, setRecordingFile] = useState<File | null>(null)
  const [recordingUrl, setRecordingUrl] = useState('')
  const [uploadingRecording, setUploadingRecording] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo')
    if (info) setStudent(JSON.parse(info))
  }, [])

  const wc1 = writingTask1.trim() ? writingTask1.trim().split(/\s+/).length : 0
  const wc2 = writingTask2.trim() ? writingTask2.trim().split(/\s+/).length : 0

  async function handleRecordingUpload(file: File) {
    setUploadingRecording(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload-recording', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload thất bại')
      setRecordingUrl(data.url)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi upload file ghi âm.')
    } finally {
      setUploadingRecording(false)
    }
  }

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
          testLevel: 3,
          readingScore,
          listeningScore,
          writingTask1,
          writingTask2,
          recordingUrl,
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
            Test 3 — Full Test (Đã học IELTS / Deadline gấp)
          </span>
          <h1 className="font-serif font-bold text-2xl mb-2" style={{ color: 'var(--navy)' }}>Bài kiểm tra Full IELTS</h1>
          {student && (
            <p className="text-gray-500 text-sm">
              Xin chào <strong>{student.studentName}</strong>! Bài test này gồm 4 kỹ năng, dành khoảng 100 phút.
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-3">Hướng dẫn làm bài</h2>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Làm Reading và Listening qua link bên dưới, ghi lại điểm.</li>
            <li>Viết Writing Task 1 (150 từ) và Task 2 (250 từ) vào các ô tương ứng.</li>
            <li>Ghi âm phần Speaking theo thứ tự Part 1 → 2 → 3, không ghi lại quá 2 lần.</li>
            <li>Upload file ghi âm và bấm Nộp bài.</li>
          </ol>
        </div>

        {/* Reading & Listening */}
        <div className="space-y-3 mb-8">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Reading & Listening</h2>
          <a
            href="https://e-learning.youpass.vn/practice/reading/6304?time=60"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-colors group"
          >
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                Reading Full Test — 60 phút
              </h3>
              <p className="text-gray-500 text-xs">YouPass IELTS Practice</p>
            </div>
            <span className="text-blue-500 text-sm font-medium">Mở →</span>
          </a>
          <a
            href="https://e-learning.youpass.vn/practice/listening/6577?time=36"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-4 transition-colors group"
          >
            <span className="text-2xl">🎧</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                Listening Full Test — 36 phút
              </h3>
              <p className="text-gray-500 text-xs">YouPass IELTS Practice</p>
            </div>
            <span className="text-green-500 text-sm font-medium">Mở →</span>
          </a>
        </div>

        {/* Speaking Questions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Speaking — Câu hỏi ghi âm</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ghi âm câu trả lời theo thứ tự. Không cần soạn trước (trừ Part 2).
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Part 1:</h3>
              <ul className="space-y-1">
                {SPEAKING_PART1.map((q, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-400 shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Part 2:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{SPEAKING_PART2}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Part 3:</h3>
              <ul className="space-y-1">
                {SPEAKING_PART3.map((q, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-400 shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">Điền kết quả & nộp bài</h2>

          {/* Scores */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm Reading</label>
              <input
                type="text"
                value={readingScore}
                onChange={(e) => setReadingScore(e.target.value)}
                placeholder="VD: 28/40"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm Listening</label>
              <input
                type="text"
                value={listeningScore}
                onChange={(e) => setListeningScore(e.target.value)}
                placeholder="VD: 31/40"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Writing Task 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Task 1 <span className="text-gray-400 font-normal">(tối thiểu 150 từ)</span>
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-600 italic">
              {WRITING_TASK1_PROMPT}
            </div>
            <textarea
              value={writingTask1}
              onChange={(e) => setWritingTask1(e.target.value)}
              rows={7}
              placeholder="Viết bài Task 1 ở đây..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className={`text-right text-xs mt-1 ${wc1 >= 150 ? 'text-green-600' : 'text-gray-400'}`}>
              {wc1} từ {wc1 >= 150 ? '✓' : `(cần thêm ${150 - wc1} từ)`}
            </p>
          </div>

          {/* Writing Task 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Task 2 <span className="text-gray-400 font-normal">(tối thiểu 250 từ)</span>
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-600 italic">
              {WRITING_TASK2_PROMPT}
            </div>
            <textarea
              value={writingTask2}
              onChange={(e) => setWritingTask2(e.target.value)}
              rows={10}
              placeholder="Viết bài Task 2 ở đây..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className={`text-right text-xs mt-1 ${wc2 >= 250 ? 'text-green-600' : 'text-gray-400'}`}>
              {wc2} từ {wc2 >= 250 ? '✓' : `(cần thêm ${250 - wc2} từ)`}
            </p>
          </div>

          {/* Speaking Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload file ghi âm Speaking
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
              {recordingFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-700">{recordingFile.name}</p>
                  {uploadingRecording && <p className="text-xs text-blue-500 mt-1">Đang upload...</p>}
                  {recordingUrl && <p className="text-xs text-green-600 mt-1">Upload thành công ✓</p>}
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">🎙️</p>
                  <p className="text-sm text-gray-500">Bấm để chọn file âm thanh</p>
                  <p className="text-xs text-gray-400 mt-1">MP3, WAV, M4A — tối đa 50MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setRecordingFile(file)
                  handleRecordingUpload(file)
                }
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || uploadingRecording}
            className="w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold font-sans py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {submitting ? 'Đang nộp bài...' : uploadingRecording ? 'Đang upload file ghi âm...' : 'Nộp bài cho Thầy Long'}
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
