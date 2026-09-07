/**
 * Lưu bài làm dở của học viên xuống localStorage.
 *
 * Trước đây toàn bộ bài làm chỉ nằm trong React state, nên học viên refresh trang,
 * bị trình duyệt kill tab (điện thoại yếu RAM), hoặc mất điện là mất sạch — kể cả
 * khi chỉ đóng một bài Reading giữa chừng, vì component bài tập bị unmount.
 * Module này là nơi duy nhất đụng tới localStorage, để mọi trang test dùng chung
 * một định dạng và một cách xử lý lỗi.
 *
 * Mọi thao tác đều bọc try/catch: localStorage có thể ném lỗi ở chế độ ẩn danh,
 * khi hết quota, hoặc khi trình duyệt chặn site data — trong các trường hợp đó
 * trang vẫn phải chạy bình thường, chỉ là không có tính năng khôi phục.
 */

const DRAFT_VERSION = 1
const DRAFT_PREFIX = 'longielts-draft'
const STUDENT_KEY = 'studentInfo'

export interface StudentInfo {
  studentName: string
  studentPhone: string
  suggestedClass: string
  testLevel: number
}

/** Cấu trúc tương thích với HighlightRange của HighlightableText. */
export interface DraftHighlight {
  start: number
  end: number
}

/** Toàn bộ state của MỘT bài Reading/Listening, đủ để dựng lại y nguyên khi mở lại. */
export interface ExerciseState {
  answers: Record<number, string>
  highlights: Record<number, DraftHighlight[]>
  submitted: boolean
  score: number
  seconds: number
}

/** File ghi âm đã upload xong — chỉ giữ tên + URL, đối tượng File không serialise được. */
export interface SavedRecording {
  name: string
  url: string
}

export interface TestDraft {
  version: number
  testLevel: number
  savedAt: number
  exercises: Record<string, ExerciseState>
  scores: Record<string, { score: number; total: number } | null>
  writingTask1: string
  writingTask2: string
  recordings: SavedRecording[]
  grammarScore: string
  vocabScore: string
}

export function emptyDraft(testLevel: number): TestDraft {
  return {
    version: DRAFT_VERSION,
    testLevel,
    savedAt: 0,
    exercises: {},
    scores: {},
    writingTask1: '',
    writingTask2: '',
    recordings: [],
    grammarScore: '',
    vocabScore: '',
  }
}

/**
 * Khoá tách riêng theo SĐT để hai học viên dùng chung một máy không đè bài của nhau.
 * Học viên chưa qua bước nhập thông tin thì dùng 'khach' làm khoá tạm.
 */
function draftKey(testLevel: number, studentPhone: string): string {
  const who = (studentPhone || '').replace(/\D/g, '') || 'khach'
  return `${DRAFT_PREFIX}-t${testLevel}-${who}`
}

export function loadDraft(testLevel: number, studentPhone: string): TestDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(draftKey(testLevel, studentPhone))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TestDraft>
    // Bản nháp của phiên bản cũ hơn có thể thiếu field — bỏ qua thay vì cố đoán,
    // an toàn hơn là dựng lại một trang hỏng.
    if (parsed?.version !== DRAFT_VERSION) return null
    return { ...emptyDraft(testLevel), ...parsed }
  } catch {
    return null
  }
}

export function saveDraft(testLevel: number, studentPhone: string, draft: Omit<TestDraft, 'version' | 'testLevel' | 'savedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const payload: TestDraft = {
      ...draft,
      version: DRAFT_VERSION,
      testLevel,
      savedAt: Date.now(),
    }
    window.localStorage.setItem(draftKey(testLevel, studentPhone), JSON.stringify(payload))
  } catch {
    // Hết quota hoặc trình duyệt chặn — bỏ qua, trang vẫn làm bài được bình thường.
  }
}

export function clearDraft(testLevel: number, studentPhone: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(draftKey(testLevel, studentPhone))
  } catch {
    // Không làm gì — xoá thất bại không ảnh hưởng tới việc nộp bài đã thành công.
  }
}

/** Bản nháp chỉ đáng khôi phục khi học viên thật sự đã làm gì đó. */
export function draftHasWork(draft: TestDraft | null): boolean {
  if (!draft) return false
  if (draft.writingTask1.trim() || draft.writingTask2.trim()) return true
  if (draft.grammarScore.trim() || draft.vocabScore.trim()) return true
  if (draft.recordings.length > 0) return true
  if (Object.values(draft.scores).some(Boolean)) return true
  return Object.values(draft.exercises).some((ex) => Object.keys(ex.answers ?? {}).length > 0)
}

export function formatSavedAt(timestamp: number): string {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  const mo = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${hh}:${mm} ngày ${dd}/${mo}`
}

/**
 * studentInfo nằm ở localStorage (không phải sessionStorage) để học viên đóng hẳn
 * trình duyệt hoặc mất điện xong mở lại vẫn không phải nhập lại tên + SĐT.
 * Vẫn ghi song song sang sessionStorage để tab nào đang mở dở từ bản deploy cũ
 * không bị mất thông tin giữa chừng.
 */
export function saveStudentInfo(info: StudentInfo): void {
  if (typeof window === 'undefined') return
  try {
    const raw = JSON.stringify(info)
    window.localStorage.setItem(STUDENT_KEY, raw)
    window.sessionStorage.setItem(STUDENT_KEY, raw)
  } catch {
    // Bỏ qua — trang test vẫn chạy, chỉ là học viên phải nhập lại nếu tải lại trang.
  }
}

export function loadStudentInfo(): StudentInfo | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STUDENT_KEY) ?? window.sessionStorage.getItem(STUDENT_KEY)
    return raw ? (JSON.parse(raw) as StudentInfo) : null
  } catch {
    return null
  }
}
