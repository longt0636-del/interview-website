export type TestLevel = 1 | 2 | 3

export interface StudentRecord {
  name: string
  phone: string
  dob: string            // col F: Ngày tháng năm sinh
  level: string          // col G: Mất gốc / Cơ bản / Trung bình / Khá / Giỏi
  ieltsStudied: string   // col V: Bạn đã từng học IELTS bao giờ chưa?
  ieltsTested: string    // col AF: Bạn đã từng thi IELTS bao giờ chưa?
  examDate: string       // col X: Bạn dự kiến thi IELTS vào thời điểm nào?
  targetBand: string     // col Z: Band IELTS bạn đang hướng tới
  skills: string         // col J: Kỹ năng muốn tập trung
  studyTime: string      // col N: Thời gian học mỗi ngày
  bestTime: string       // col O: Thời gian học tốt nhất
  workplace: string      // col S: Nơi học tập hoặc làm việc hiện tại
  learningFormat: string // col AD: Bạn thích học hình thức nào?
  rowIndex: number
}

// Ước tính "học lớp mấy" từ ngày sinh, theo quy tắc tuyển sinh VN
// (xếp lớp theo NĂM sinh, không theo ngày/tháng cụ thể — lớp 1 vào năm tròn 6 tuổi).
export function estimateGradeFromDOB(dobStr: string): string {
  if (!dobStr) return ''

  const match = dobStr.trim().match(/(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})|(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})/)
  const birthYear = match ? parseInt(match[3] || match[4]) : NaN
  if (!birthYear || Number.isNaN(birthYear)) return ''

  const now = new Date()
  // Năm học VN bắt đầu tháng 9 — trước tháng 9 vẫn tính là năm học bắt đầu từ tháng 9 năm trước
  const schoolYearStart = now.getMonth() + 1 >= 9 ? now.getFullYear() : now.getFullYear() - 1
  const grade = schoolYearStart - birthYear - 5

  if (grade < 1) return 'Chưa vào lớp 1'
  if (grade > 12) return 'Đã tốt nghiệp THPT / người đi làm'
  return `Lớp ${grade}`
}

function monthsUntilExam(examDateStr: string): number | null {
  if (!examDateStr) return null
  const now = new Date()
  const lower = examDateStr.toLowerCase()

  // "Trong 3–4 tháng tới" style multiple-choice responses → use midpoint
  const rangeMatch = lower.match(/trong\s*(\d+)[–\-]\s*(\d+)\s*tháng/)
  if (rangeMatch) {
    return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2
  }

  // "Trong X tháng tới"
  const singleMatch = lower.match(/trong\s*(\d+)\s*tháng/)
  if (singleMatch) {
    return parseInt(singleMatch[1])
  }

  // "tháng X/YYYY" specific month
  const monthMatch = lower.match(/tháng\s*(\d{1,2})\s*[/\-]?\s*(\d{4})/)
  if (monthMatch) {
    const month = parseInt(monthMatch[1]) - 1
    const year = parseInt(monthMatch[2])
    const target = new Date(year, month, 1)
    return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
  }

  // Standard date string
  const parsed = new Date(examDateStr)
  if (!isNaN(parsed.getTime())) {
    return Math.round((parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
  }

  return null
}

// Col V ("Bạn đã từng học IELTS bao giờ chưa?") is free text, not a Yes/No field.
// Strip common Vietnamese filler/pronoun prefixes, then check if what remains
// starts with a negation word ("chưa", "không", "ko") → treated as "hasn't studied".
function hasStudiedIeltsBefore(ieltsStudied: string): boolean {
  const text = ieltsStudied.trim().toLowerCase()
  if (!text) return false
  const stripped = text.replace(/^(dạ\s+|em\s+|e\s+|con\s+|mình\s+|tôi\s+)+/, '')
  return !/^(chưa|không|ko)\b/.test(stripped)
}

export function determineTestLevel(student: StudentRecord): TestLevel {
  const months = monthsUntilExam(student.examDate)

  // Primary rule: exam coming up within 4 months → full test (Test 3) immediately
  if (months !== null && months <= 4) return 3

  // Also qualifies for Test 3: exam within 5–6 months AND already studied IELTS elsewhere
  if (months !== null && months <= 6 && hasStudiedIeltsBefore(student.ieltsStudied)) return 3

  // Fallback: route by current level
  const lvl = student.level.toLowerCase()
  if (lvl.includes('mất gốc') || lvl.includes('cơ bản')) return 1

  return 2
}

export interface WritingAnalysis {
  wordCount: number
  hasEnoughWords: boolean
  vocabLevel: string
  grammarNote: string
}

export interface LevelFeedback {
  headline: string
  detail: string
}

/** Analyze a writing submission for word count, vocab complexity, and sentence variety. */
export function analyzeWriting(text: string, minWords: number): WritingAnalysis {
  if (!text || !text.trim()) {
    return {
      wordCount: 0,
      hasEnoughWords: false,
      vocabLevel: 'Chưa có bài viết',
      grammarNote: 'Chưa có bài viết',
    }
  }
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0)
  const avgSentenceLength = wordCount / Math.max(sentences.length, 1)
  // Complex words: length > 7 letters (rough indicator of academic vocabulary)
  const complexWords = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length > 7).length
  const complexRatio = complexWords / Math.max(wordCount, 1)

  const vocabLevel =
    complexRatio > 0.22
      ? 'Từ vựng đa dạng, phù hợp với yêu cầu IELTS'
      : complexRatio > 0.12
      ? 'Từ vựng ở mức trung bình — có thể phong phú hơn'
      : 'Từ vựng cơ bản — nên bổ sung từ học thuật'

  const grammarNote =
    avgSentenceLength > 18
      ? 'Cấu trúc câu đa dạng, sử dụng câu phức tốt'
      : avgSentenceLength > 11
      ? 'Cấu trúc câu trung bình — có thể thêm câu phức'
      : 'Câu văn ngắn và đơn giản — nên luyện câu phức hơn'

  return { wordCount, hasEnoughWords: wordCount >= minWords, vocabLevel, grammarNote }
}

/** Return a general (non-score-specific) level headline + detail for the student result page. */
export function getLevelFeedback(
  testLevel: number,
  submission: {
    grammarScore?: string
    vocabScore?: string
    readingScore?: string
    listeningScore?: string
  }
): LevelFeedback {
  if (testLevel === 1) {
    const g = parseRawScore(submission.grammarScore || '')
    const v = parseRawScore(submission.vocabScore   || '')
    return (g + v) >= 55
      ? { headline: 'Nền tảng đang hình thành', detail: 'Bạn có vốn từ và ngữ pháp cơ bản, sẵn sàng bắt đầu lộ trình IELTS có cấu trúc.' }
      : { headline: 'Cần củng cố nền tảng', detail: 'Bạn đang ở giai đoạn đặt nền tảng tiếng Anh — đây là khởi điểm quan trọng trước khi luyện IELTS chuyên sâu.' }
  }
  if (testLevel === 2) {
    const r = parseRawScore(submission.readingScore || '')
    if (r >= 10) return { headline: 'Trình độ khá', detail: 'Kỹ năng đọc hiểu và ngôn ngữ của bạn khá tốt. Lớp luyện IELTS chuyên sâu sẽ giúp bạn đạt band mục tiêu nhanh hơn.' }
    if (r >= 5)  return { headline: 'Trình độ trung bình', detail: 'Bạn có nền tảng cơ bản và đang phát triển kỹ năng IELTS. Cần luyện thêm Reading và Listening để tăng band.' }
    return { headline: 'Cần cải thiện', detail: 'Bạn cần tập trung củng cố từ vựng và ngữ pháp để sẵn sàng cho các kỹ năng IELTS chuyên sâu.' }
  }
  if (testLevel === 3) {
    const r = parseRawScore(submission.readingScore   || '')
    const l = parseRawScore(submission.listeningScore || '')
    const rBand = r > 10 ? (r / 40) * 9 : r
    const lBand = l > 10 ? (l / 40) * 9 : l
    const avg = r > 0 && l > 0 ? (rBand + lBand) / 2 : Math.max(rBand, lBand)
    if (avg >= 7.0) return { headline: 'Trình độ giỏi', detail: 'Kỹ năng IELTS của bạn rất vững. Cần luyện sâu Writing và Speaking để chốt band mục tiêu.' }
    if (avg >= 5.5) return { headline: 'Trình độ khá', detail: 'Bạn có nền tảng IELTS tốt. Cần tinh chỉnh kỹ năng và luyện đề thật để nâng band đúng mục tiêu.' }
    return { headline: 'Đang phát triển', detail: 'Bạn có nền tảng nhất định nhưng cần rèn luyện thêm để chạm đến target band.' }
  }
  return { headline: 'Kết quả đã ghi nhận', detail: 'Thầy Long sẽ xem xét chi tiết và tư vấn lộ trình phù hợp nhất.' }
}

/**
 * If a student scored weak (reading ≤ 4/13) on Test 2 but has an urgent deadline,
 * they are placed in Căn Bản instead of their natural Nền Tảng level.
 * Return a notice string to surface this mismatch.
 */
export function getClassSpecialNotice(
  testLevel: number,
  readingScore: string | undefined,
  examDate: string
): string | null {
  if (testLevel !== 2) return null
  const months = monthsUntilExam(examDate)
  const isUrgent = months !== null && months <= 12
  if (!isUrgent) return null
  const reading = parseRawScore(readingScore || '')
  if (reading < 5) {
    return 'Lưu ý: Năng lực thực tế của học viên phù hợp với lớp Nền Tảng (3–4), nhưng do thời gian thi gấp, đề xuất vào lớp Căn Bản (4–5) để đẩy nhanh tiến độ.'
  }
  return null
}

export function suggestClass(testLevel: TestLevel, studentLevel: string): string {
  const lvl = studentLevel.toLowerCase()
  if (testLevel === 1 || lvl.includes('mất gốc') || lvl.includes('cơ bản')) {
    return 'IELTS Nền Tảng (Trình độ 3-4)'
  }
  if (testLevel === 2 || lvl.includes('trung bình') || lvl.includes('khá')) {
    return 'IELTS Căn Bản (Trình độ 4-5)'
  }
  return 'Complete IELTS (Trình độ 5-6+)'
}

// Parse a score string like "9/13", "8,5", "8.5", or "8" → numeric value
function parseRawScore(scoreStr: string): number {
  if (!scoreStr) return 0
  const cleaned = scoreStr.replace(',', '.').trim()
  const slashMatch = cleaned.match(/^(\d+\.?\d*)\//)
  if (slashMatch) return parseFloat(slashMatch[1])
  return parseFloat(cleaned) || 0
}

/**
 * Suggest a class based on ACTUAL test scores + time until exam.
 * Called after the student submits results, so we have real data.
 *
 * Time rules (per Long's instruction):
 *   ≤ 12 months → bump up one level (urgency)
 *   12–18 months → follow scores, Road to IELTS only if strong
 *   > 18 months → purely score-based
 *
 * Test 2 thresholds (reading /13):
 *   ≥ 10 → strong, ≥ 5 → medium, < 5 → weak
 *
 * Test 3 thresholds:
 *   Scores > 10 are treated as raw /40; ≤ 10 as IELTS band.
 *   Effective band ≥ 5.0 → Road to IELTS.
 */
export function suggestClassFromScores(
  submission: {
    testLevel: number
    grammarScore?: string
    vocabScore?: string
    readingScore?: string
    listeningS1?: string
    listeningS2?: string
    listeningScore?: string
  },
  examDate: string
): string {
  const months = monthsUntilExam(examDate)
  const isUrgent   = months !== null && months <= 12
  const isModerate = months !== null && months > 12 && months <= 18

  // Test 1 (mất gốc): fundamentals are missing → always Nền Tảng
  if (submission.testLevel === 1) {
    return 'IELTS Nền Tảng (Trình độ 3-4)'
  }

  // Test 2 (partial): Reading /13, Listening S1+S2 /10 each
  if (submission.testLevel === 2) {
    const reading = parseRawScore(submission.readingScore || '')
    const readingLevel = reading >= 10 ? 'high' : reading >= 5 ? 'medium' : 'low'

    if (isUrgent) {
      // < 1 year: bump up
      if (readingLevel === 'low') return 'IELTS Căn Bản (Trình độ 4-5)'
      return 'Complete IELTS (Trình độ 5-6+)'
    }
    if (isModerate) {
      // 1–1.5 years: high score → Road, otherwise Căn Bản
      if (readingLevel === 'high') return 'Complete IELTS (Trình độ 5-6+)'
      return 'IELTS Căn Bản (Trình độ 4-5)'
    }
    // > 1.5 years or no deadline: pure score
    if (readingLevel === 'high')   return 'Complete IELTS (Trình độ 5-6+)'
    if (readingLevel === 'medium') return 'IELTS Căn Bản (Trình độ 4-5)'
    return 'IELTS Nền Tảng (Trình độ 3-4)'
  }

  // Test 3 (full IELTS): reading + listening scores
  if (submission.testLevel === 3) {
    const r = parseRawScore(submission.readingScore  || '')
    const l = parseRawScore(submission.listeningScore || '')
    // Normalize: scores > 10 are raw /40; ≤ 10 are band scores
    const rBand = r > 10 ? (r / 40) * 9 : r
    const lBand = l > 10 ? (l / 40) * 9 : l
    const avg = r > 0 && l > 0 ? (rBand + lBand) / 2 : Math.max(rBand, lBand)
    if (avg < 5.0) return 'IELTS Căn Bản (Trình độ 4-5)'
    return 'Complete IELTS (Trình độ 5-6+)'
  }

  return 'IELTS Căn Bản (Trình độ 4-5)'
}
