'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { PromiseResubmit } from '@/components/ui/promise-resubmit'
import { ReadingListeningExercise } from '@/components/test-exercise/ReadingListeningExercise'
import { DraftRestoredBanner } from '@/components/test-exercise/DraftRestoredBanner'
import { TEST3_SECTIONS } from '@/lib/test3-content'
import { BookOpenIcon, HeadphonesIcon, MicIcon, WarningIcon } from '@/components/ui/icons'
import {
  loadStudentInfo,
  loadDraft,
  saveDraft,
  clearDraft,
  draftHasWork,
  type StudentInfo,
  type ExerciseState,
} from '@/lib/test-draft'

const TEST_LEVEL = 3

interface RecordingItem {
  id: string
  fileName: string
  url: string
  uploading: boolean
  progress: number
  error: string
}

const EXERCISE_CARDS: { id: string; Icon: typeof BookOpenIcon; title: string; shortLabel: string; group: 'reading' | 'listening' }[] = [
  { id: 'readingP1', Icon: BookOpenIcon, title: 'Reading Passage 1 — Roman tunnels', shortLabel: 'Reading P1', group: 'reading' },
  { id: 'readingP2', Icon: BookOpenIcon, title: 'Reading Passage 2 — Changes in reading habits', shortLabel: 'Reading P2', group: 'reading' },
  { id: 'readingP3', Icon: BookOpenIcon, title: 'Reading Passage 3 — Attitudes towards AI', shortLabel: 'Reading P3', group: 'reading' },
  { id: 'listeningS1', Icon: HeadphonesIcon, title: 'Listening Part 1 — Holiday rental', shortLabel: 'Listening P1', group: 'listening' },
  { id: 'listeningS2', Icon: HeadphonesIcon, title: 'Listening Part 2 — Traffic & recreation ground', shortLabel: 'Listening P2', group: 'listening' },
  { id: 'listeningS3', Icon: HeadphonesIcon, title: 'Listening Part 3 — Bike-sharing schemes', shortLabel: 'Listening P3', group: 'listening' },
  { id: 'listeningS4', Icon: HeadphonesIcon, title: 'Listening Part 4 — The dodo bird', shortLabel: 'Listening P4', group: 'listening' },
]

const EXERCISE_ORDER = EXERCISE_CARDS.map((c) => c.id)

const CARD_GROUPS = [
  { group: 'reading', heading: 'Reading', count: 3, border: 'border-blue-200 hover:border-blue-400', hoverText: 'group-hover:text-blue-600', iconColor: '#2563eb', ctaColor: '#3B82F6' },
  { group: 'listening', heading: 'Listening', count: 4, border: 'border-green-200 hover:border-green-400', hoverText: 'group-hover:text-green-600', iconColor: '#16a34a', ctaColor: '#22C55E' },
] as const

// file.type do trình duyệt tự đoán không đáng tin cậy (đặc biệt .m4a ghi từ iPhone/Safari
// thường trả về rỗng hoặc 'audio/x-m4a'). Suy content-type từ đuôi file để luôn gửi giá trị
// chuẩn lên Vercel Blob, thay vì phụ thuộc vào MIME type trình duyệt tự gán.
const AUDIO_MIME_BY_EXT: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
  '.webm': 'audio/webm',
  '.aac': 'audio/aac',
  // Máy ghi âm mặc định của Android + tin nhắn thoại Zalo hay cho ra mấy đuôi này (thêm 17/09/2026,
  // xem chú thích dài ở app/api/upload-recording/route.ts).
  '.amr': 'audio/amr',
  '.3gp': 'video/3gpp',
  '.3gpp': 'video/3gpp',
  '.opus': 'audio/ogg',
  '.flac': 'audio/flac',
  '.wma': 'audio/x-ms-wma',
  '.mp4': 'video/mp4',
  '.caf': 'audio/x-caf',
}

const MAX_RECORDING_BYTES = 50 * 1024 * 1024

// Nói cho học viên biết CHUYỆN GÌ XẢY RA và LÀM GÌ TIẾP, thay vì đưa nguyên câu tiếng Anh của thư
// viện upload. 17/09/2026: chọn nhầm file `.amr` (máy Android hay ghi kiểu này) thì thứ hiện ra là
// "Vercel Blob: Failed to retrieve the client token" — không ai đoán được là do định dạng file.
/** Gửi file ghi âm lên máy chủ (bản Cloudflare) — XMLHttpRequest để có thanh tiến độ như thư viện Vercel Blob. */
function putRecording(pathname: string, file: File, contentType: string, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', `/api/upload-recording?path=${encodeURIComponent(pathname)}`)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let body: { pathname?: string; error?: string } = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        // để trống — báo lỗi chung bên dưới
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.pathname) resolve(body.pathname)
      else reject(new Error(body.error || `upload HTTP ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('network error'))
    xhr.ontimeout = () => reject(new Error('timeout'))
    xhr.send(file)
  })
}

function friendlyUploadError(raw: unknown): string {
  const text = raw instanceof Error ? raw.message : String(raw ?? '')
  if (/định dạng|dung lượng|quá 50MB/i.test(text)) return text
  if (/client token|Failed to retrieve|BlobError/i.test(text)) {
    return 'Không gửi được file này lên. Bạn thử chọn lại file, hoặc đổi sang file MP3/M4A rồi thử lại. Vẫn không được thì nhắn Zalo cho Thầy Long kèm tên file nhé.'
  }
  if (/fetch|network|Load failed|timeout/i.test(text)) {
    return 'Mạng bị gián đoạn nên file chưa lên được. Bạn kiểm tra wifi/4G rồi bấm chọn lại file nhé — phần bài đã làm vẫn còn nguyên.'
  }
  return 'Chưa gửi được file ghi âm. Bạn thử chọn lại file một lần nữa nhé.'
}

function getNextExerciseId(current: string): string | null {
  const idx = EXERCISE_ORDER.indexOf(current)
  return idx >= 0 && idx < EXERCISE_ORDER.length - 1 ? EXERCISE_ORDER[idx + 1] : null
}

const READING_IDS = ['readingP1', 'readingP2', 'readingP3']
const LISTENING_IDS = ['listeningS1', 'listeningS2', 'listeningS3', 'listeningS4']

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

const EMPTY_SCORES: Record<string, { score: number; total: number } | null> = {
  readingP1: null,
  readingP2: null,
  readingP3: null,
  listeningS1: null,
  listeningS2: null,
  listeningS3: null,
  listeningS4: null,
}

export default function Test3Page() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [scores, setScores] = useState<Record<string, { score: number; total: number } | null>>({ ...EMPTY_SCORES })
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null)
  const [writingTask1, setWritingTask1] = useState('')
  const [writingTask2, setWritingTask2] = useState('')
  const [recordings, setRecordings] = useState<RecordingItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filesByIdRef = useRef<Map<string, File>>(new Map())

  // Bài làm dở của từng phần Reading/Listening — giữ ở trang cha thay vì trong
  // component bài tập, vì component đó bị unmount mỗi lần học viên đóng bài lại.
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({})
  // Chỉ bắt đầu tự lưu SAU khi đã đọc xong bản nháp cũ, nếu không lần lưu đầu tiên
  // (state còn rỗng) sẽ ghi đè mất bài làm vừa khôi phục.
  const [hydrated, setHydrated] = useState(false)
  const [restoredAt, setRestoredAt] = useState(0)

  const studentPhone = student?.studentPhone ?? ''

  useEffect(() => {
    const info = loadStudentInfo()
    if (info) setStudent(info)

    const draft = loadDraft(TEST_LEVEL, info?.studentPhone ?? '')
    if (draftHasWork(draft) && draft) {
      setScores({ ...EMPTY_SCORES, ...draft.scores })
      setExerciseStates(draft.exercises)
      setWritingTask1(draft.writingTask1)
      setWritingTask2(draft.writingTask2)
      setRecordings(
        draft.recordings.map((r) => ({
          id: crypto.randomUUID(),
          fileName: r.name,
          url: r.url,
          uploading: false,
          progress: 100,
          error: '',
        }))
      )
      setRestoredAt(draft.savedAt)
    }
    setHydrated(true)
  }, [])

  // Tự lưu sau mỗi thay đổi. setTimeout + clearTimeout ở cleanup tạo hiệu ứng
  // debounce: gõ liên tục thì chỉ ghi một lần sau khi ngừng 500ms.
  useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      saveDraft(TEST_LEVEL, studentPhone, {
        exercises: exerciseStates,
        scores,
        writingTask1,
        writingTask2,
        recordings: recordings.filter((r) => r.url).map((r) => ({ name: r.fileName, url: r.url })),
        grammarScore: '',
        vocabScore: '',
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [hydrated, studentPhone, exerciseStates, scores, writingTask1, writingTask2, recordings])

  function handleDiscardDraft() {
    clearDraft(TEST_LEVEL, studentPhone)
    setScores({ ...EMPTY_SCORES })
    setExerciseStates({})
    setWritingTask1('')
    setWritingTask2('')
    setRecordings([])
    setRestoredAt(0)
  }

  const wc1 = writingTask1.trim() ? writingTask1.trim().split(/\s+/).length : 0
  const wc2 = writingTask2.trim() ? writingTask2.trim().split(/\s+/).length : 0

  function combinedScore(ids: string[]): string {
    const anyDone = ids.some((id) => scores[id])
    if (!anyDone) return ''
    const score = ids.reduce((sum, id) => sum + (scores[id]?.score ?? 0), 0)
    const total = ids.reduce((sum, id) => sum + TEST3_SECTIONS[id].totalQuestions, 0)
    return `${score}/${total}`
  }

  const readingScore = combinedScore(READING_IDS)
  const listeningScore = combinedScore(LISTENING_IDS)
  const readingDoneCount = READING_IDS.filter((id) => scores[id]).length
  const listeningDoneCount = LISTENING_IDS.filter((id) => scores[id]).length
  const nextExerciseId = activeExerciseId ? getNextExerciseId(activeExerciseId) : null

  const recordingUrls = recordings.filter((r) => r.url).map((r) => r.url)
  const uploadingRecording = recordings.some((r) => r.uploading)

  const missingParts: string[] = []
  if (!writingTask1.trim()) missingParts.push('Writing Task 1')
  if (!writingTask2.trim()) missingParts.push('Writing Task 2')
  if (recordingUrls.length === 0) missingParts.push('Speaking (file ghi âm)')

  const hasUnsubmittedWork =
    Object.values(scores).some(Boolean) ||
    Object.values(exerciseStates).some((ex) => Object.keys(ex.answers ?? {}).length > 0) ||
    !!writingTask1.trim() ||
    !!writingTask2.trim() ||
    recordings.length > 0

  // Lớp bảo vệ cuối: bài đã được tự lưu, nhưng localStorage có thể bị chặn (chế độ
  // ẩn danh, trình duyệt cấm site data) — lúc đó cảnh báo này là thứ duy nhất cứu
  // được học viên khỏi việc lỡ tay đóng tab.
  useEffect(() => {
    if (!hasUnsubmittedWork || submitting) return
    function warn(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasUnsubmittedWork, submitting])

  // Upload thẳng từ trình duyệt lên Vercel Blob (không qua API route của mình) —
  // API route chỉ cấp token. Bắt buộc vì Vercel Serverless Function giới hạn body
  // request ở 4.5MB, trong khi file ghi âm Speaking thật (10-15 phút) thường vượt
  // mốc này, khiến upload luôn thất bại dù test bằng file nhỏ lúc dev thì vẫn ổn.
  // File gốc được truyền riêng chứ không giữ trong state: đối tượng File không
  // serialise được xuống localStorage, mà state này thì cần lưu lại để khôi phục.
  async function uploadRecording(id: string, file: File) {
    setError('')
    try {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const ext = safeName.slice(safeName.lastIndexOf('.')).toLowerCase()

      // Chặn ngay tại máy học viên, TRƯỚC khi gọi lên server: hai lỗi này server cũng chặn, nhưng
      // lúc đó câu giải thích của mình bị thư viện upload nuốt mất, em chỉ còn thấy tiếng Anh.
      if (!AUDIO_MIME_BY_EXT[ext]) {
        throw new Error(
          `File "${file.name}" không phải định dạng ghi âm mà hệ thống đọc được. Bạn gửi file MP3, M4A hoặc WAV nhé (mở app Ghi âm → chọn bài ghi → Chia sẻ → Lưu vào Files).`
        )
      }
      if (file.size > MAX_RECORDING_BYTES) {
        throw new Error(
          `File "${file.name}" nặng ${(file.size / 1048576).toFixed(0)}MB, vượt dung lượng cho phép (50MB). Bạn thu lại ngắn hơn, hoặc chia thành 2-3 file rồi gửi cả mấy file cùng lúc nhé.`
        )
      }

      const contentType = AUDIO_MIME_BY_EXT[ext] || file.type || 'application/octet-stream'

      const onProgress = (percentage: number) =>
        setRecordings((prev) => prev.map((r) => (r.id === id ? { ...r, progress: percentage } : r)))
      const pathname = `recordings/${timestamp}_${safeName}`
      // Cloudflare (25/10/2026): gửi thẳng file lên máy chủ của web, máy chủ cất vào kho R2 riêng tư (không giới hạn
      // 4,5 MB như Vercel). Bản Vercel vẫn gửi thẳng lên Vercel Blob như trước.
      const storedPath =
        process.env.NEXT_PUBLIC_RECORDING_STORE === 'r2'
          ? await putRecording(pathname, file, contentType, onProgress)
          : (
              await upload(pathname, file, {
                access: 'private',
                contentType,
                multipart: true,
                handleUploadUrl: '/api/upload-recording',
                onUploadProgress: ({ percentage }) => onProgress(percentage),
              })
            ).pathname

      const proxyUrl = `${window.location.origin}/api/recording?path=${encodeURIComponent(storedPath)}`
      setRecordings((prev) => prev.map((r) => (r.id === id ? { ...r, url: proxyUrl, uploading: false } : r)))
    } catch (e: unknown) {
      const message = friendlyUploadError(e)
      setRecordings((prev) => prev.map((r) => (r.id === id ? { ...r, uploading: false, error: message } : r)))
    }
  }

  // Học viên có thể thu nhiều lần (nhiều take) và upload tất cả cùng lúc — mỗi file
  // được nộp riêng, không bị bắt buộc chọn ra 1 file duy nhất trước khi nộp.
  function handleFilesSelected(fileList: FileList) {
    const picked = Array.from(fileList).map((file) => ({ id: crypto.randomUUID(), file }))
    // Giữ file gốc lại trong phiên làm bài này để bấm "Thử lại" được. KHÔNG để trong state vì state
    // được lưu xuống máy (localStorage) mà đối tượng File thì không lưu xuống được.
    picked.forEach(({ id, file }) => filesByIdRef.current.set(id, file))
    setRecordings((prev) => [
      ...prev,
      ...picked.map(({ id, file }) => ({
        id,
        fileName: file.name,
        url: '',
        uploading: true,
        progress: 0,
        error: '',
      })),
    ])
    picked.forEach(({ id, file }) => uploadRecording(id, file))
  }

  function removeRecording(id: string) {
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Cho phép nộp bài dở. Trước đây nút Nộp bị khoá cho tới khi đủ cả 3 phần, nên
    // học viên không kịp làm hết trong một lần ngồi thì thầy Long không nhận được gì —
    // nhận bài thiếu vẫn hơn mất trắng.
    if (missingParts.length > 0) {
      const ok = window.confirm(
        `Bạn chưa hoàn thành: ${missingParts.join(', ')}.\n\n` +
        'Vẫn nộp phần đã làm cho thầy Long? Thầy sẽ nhận được đúng những gì bạn đã hoàn thành.'
      )
      if (!ok) return
    }

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
          recordingUrl: recordingUrls.join('\n'),
          missingParts,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Nộp xong mới xoá bản nháp — nếu nộp lỗi, bài làm vẫn còn nguyên trên máy.
      clearDraft(TEST_LEVEL, studentPhone)
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

        {restoredAt > 0 && <DraftRestoredBanner savedAt={restoredAt} onDiscard={handleDiscardDraft} />}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-3">Hướng dẫn làm bài</h2>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Bấm vào từng thẻ Reading/Listening bên dưới để làm bài ngay trên trang này.</li>
            <li>Làm xong bấm &quot;Hoàn thành&quot; — hệ thống tự chấm điểm, không cần tự ghi.</li>
            <li>Viết Writing Task 1 (150 từ) và Task 2 (250 từ) vào các ô tương ứng.</li>
            <li>Ghi âm phần Speaking theo thứ tự Part 1 → 2 → 3, không ghi lại quá 2 lần.</li>
            <li>Upload file ghi âm và bấm Nộp bài.</li>
          </ol>
        </div>

        {/* Reading & Listening */}
        <div className="space-y-6 mb-8">
          {CARD_GROUPS.map((g) => (
            <div key={g.group} className="space-y-3">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                {g.heading} — {g.group === 'reading' ? readingDoneCount : listeningDoneCount}/{g.count} phần đã làm
              </h2>
              {EXERCISE_CARDS.filter((c) => c.group === g.group).map((card) => {
                const result = scores[card.id]
                const section = TEST3_SECTIONS[card.id]
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveExerciseId(card.id)}
                    className={`w-full flex items-center gap-4 bg-white border-2 ${g.border} rounded-xl p-4 transition-colors group text-left`}
                  >
                    <card.Icon className="w-6 h-6 shrink-0" style={{ color: g.iconColor }} />
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-800 ${g.hoverText} transition-colors`}>
                        {card.title} <span className="text-gray-400 font-normal text-xs">— {section.timeLabel}</span>
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {result ? `Đã hoàn thành: ${result.score}/${result.total} câu đúng` : 'Chưa làm'}
                      </p>
                    </div>
                    <span className="text-sm font-medium shrink-0" style={{ color: result ? 'var(--teal)' : g.ctaColor }}>
                      {result ? 'Làm lại →' : 'Bắt đầu →'}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {activeExerciseId && (
          <ReadingListeningExercise
            key={activeExerciseId}
            section={TEST3_SECTIONS[activeExerciseId]}
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
            initialState={exerciseStates[activeExerciseId] ?? null}
            onStateChange={(state) =>
              setExerciseStates((prev) => ({ ...prev, [activeExerciseId]: state }))
            }
          />
        )}

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

          {/* Scores (tự động, không cần tự ghi) */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Điểm Reading (tự động)</p>
              <p className="font-mono font-semibold text-lg" style={{ color: readingScore ? 'var(--teal)' : '#D1D5DB' }}>
                {readingScore || '—'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Điểm Listening (tự động)</p>
              <p className="font-mono font-semibold text-lg" style={{ color: listeningScore ? 'var(--teal)' : '#D1D5DB' }}>
                {listeningScore || '—'}
              </p>
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
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-2 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/test3/writing-task1-chart.png"
                alt="Biểu đồ lượng rác thải của 3 công ty từ 2000 đến 2015"
                className="w-full h-auto"
              />
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
            <p className="text-xs text-gray-400 mb-2">
              Thu nhiều lần (nhiều take)? Chọn hoặc thêm tất cả file cùng lúc — không cần chọn ra 1 file duy nhất.
            </p>

            {recordings.length > 0 && (
              <div className="space-y-2 mb-3">
                {recordings.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{r.fileName}</p>
                      {r.uploading && <p className="text-xs text-blue-500 mt-0.5">Đang upload... {r.progress}%</p>}
                      {r.url && <p className="text-xs text-green-600 mt-0.5">Upload thành công ✓</p>}
                      {r.error && <p className="text-xs text-red-500 mt-0.5">{r.error}</p>}
                      {/* File vẫn còn trong máy — cho bấm lại một cái, khỏi phải đi tìm file lần nữa.
                          Trừ khi lỗi là do định dạng/dung lượng: bấm lại cũng hỏng y hệt. */}
                      {r.error && !/định dạng|dung lượng/i.test(r.error) && filesByIdRef.current.has(r.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            const file = filesByIdRef.current.get(r.id)
                            if (!file) return
                            setRecordings((prev) =>
                              prev.map((x) => (x.id === r.id ? { ...x, uploading: true, progress: 0, error: '' } : x))
                            )
                            uploadRecording(r.id, file)
                          }}
                          className="mt-1.5 text-xs font-semibold text-blue-600 underline underline-offset-2"
                        >
                          Thử gửi lại file này
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRecording(r.id)}
                      aria-label={`Xoá file ghi âm ${r.fileName}`}
                      className="shrink-0 flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
              <MicIcon className="w-7 h-7 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                {recordings.length > 0 ? 'Bấm để thêm file khác' : 'Bấm để chọn file âm thanh'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                MP3, M4A, WAV hoặc file ghi âm sẵn của điện thoại — tối đa 50MB/file
              </p>
            </div>
            {/* Vài máy Android xếp file ghi âm `.3gp`/`.amr` vào nhóm VIDEO, nên để mỗi `audio/*` là
                chúng biến mất khỏi danh sách chọn file — học viên tưởng máy mất bài ghi âm. */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/3gpp,video/mp4,.amr,.3gp,.3gpp,.opus,.caf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFilesSelected(e.target.files)
                }
                e.target.value = ''
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || uploadingRecording || !hasUnsubmittedWork}
            className="w-full disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold font-sans py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {submitting
              ? 'Đang nộp bài...'
              : uploadingRecording
              ? 'Đang upload file ghi âm...'
              : missingParts.length > 0
              ? 'Nộp phần đã làm cho Thầy Long'
              : 'Nộp bài cho Thầy Long'}
          </button>
          {missingParts.length > 0 && hasUnsubmittedWork && (
            <p className="text-center text-xs font-medium font-sans" style={{ color: 'var(--navy)' }}>
              <WarningIcon className="w-4 h-4 inline-block align-[-2px] mr-1" />Bạn chưa làm: {missingParts.join(', ')} — vẫn nộp được phần đã làm nếu cần.
            </p>
          )}
          <p className="text-center text-gray-400 text-xs">
            Bài làm được tự động lưu trên máy này. Đóng trang hay mất điện xong mở lại
            vẫn thấy nguyên bài đang làm dở.
          </p>
        </form>
        <PromiseResubmit raised={!!activeExerciseId} />
      </div>
    </main>
  )
}
