// Phần dùng chung cho brochure 3 khoá (Nền Tảng 3-4 · Căn Bản 4-5 · Road to IELTS 5-6), Long 16/11/2026.
// Luật chung (bản 2, thuyết noticing): ít chữ; chỉ tô cam ([[...]]) đúng thông tin chính; mỗi ý có hình hoặc chuyển động làm
// bằng chứng; không số liệu bịa. Nội dung từng khoá ở lib/brochures/<khoá>.ts; khung dựng ở app/khoa-hoc/_brochure/.

export const FORM_URL = 'https://docs.google.com/forms/d/1sZbzR4G_j-YYpKKBcQ5bNwHhfQEH9a0k9GaJW4FCtjk/viewform'
export const ZALO_URL = 'https://zalo.me/0367832164'
export const ZALO_DISPLAY = '036 783 2164'
export const ADDRESS = '289/26 Hồ Tùng Mậu, Bảo Lộc'
export const SITE = 'https://test.longielts.website'
export const SITE_HOST = 'test.longielts.website'
export const PORTAL = 'longielts.website'
export const UPDATED = '11/2026'

/** Thầy Long: phiếu điểm IELTS dùng cho mọi brochure (điểm nhấn của trang). Số thật, thi 01/07/2025. */
export const founder = {
  name: 'Thầy Trần Nhật Long',
  testDate: '01/07/2025',
  scores: [
    { k: 'Listening', v: '9.0' },
    { k: 'Reading', v: '9.0' },
    { k: 'Writing', v: '7.5' },
    { k: 'Speaking', v: '7.5' },
  ],
  overall: '8.5',
}

export type Teacher = {
  id: string
  name: string
  badge: string
  photo?: string
  photoAlt: string
  points: string[]
}

/** Một đoạn trên đường thời gian chương 1 (đơn vị: tháng). course = khoá đang giới thiệu (tô cam, tô dần theo cuộn). */
export type Seg = { months: number; kind: 'before' | 'course' | 'after'; label: string }

/** Các hình động nhỏ có sẵn trong app/khoa-hoc/_brochure/parts.tsx (ArtPiece). */
export type ArtKey =
  | 'flashcard'
  | 'wave'
  | 'grammar'
  | 'read'
  | 'pen'
  | 'ship'
  | 'ipa'
  | 'speak'
  | 'chart'
  | 'essay'

export type Session = { n: string; title: string; isNew?: string; sub?: string; arts: ArtKey[] }

/** Một tính năng trang học; scene = cảnh tương ứng trong video trang học (bấm là tua tới cảnh đó). */
export type WebFeature = { title: string; text: string; scene: 'writing' | 'speak' | 'quiz' | 'vocab' | 'phone' }

export type Brochure = {
  slug: string
  path: string
  pdf: string
  metaTitle: string
  metaDesc: string
  ogTitle: string
  ogDesc: string
  hero: { eyebrow: string; title: string; from: string; to: string; sub: string; numeral: string }
  forWho: {
    title: string
    line1: string
    line2: string
    timeline: { caption: string; segs: Seg[]; ends: { at: number; label: string }[] }
  }
  founderRole: string
  founderCreds: string[]
  founderPhoto?: { src: string; alt: string; caption: string }
  teamTitle?: string
  teachers: Teacher[]
  teachersNote?: string
  sessionsTitle: string
  sessionLabel: string
  sessions: Session[]
  /** Chữ trong hình động (thẻ từ, câu ngữ pháp, câu hỏi nói) cho hợp trình độ khoá. */
  artText?: { front?: string; back?: string; gram?: [string, string, string]; speakQ?: string }
  web: { title: string; lead: string; features: WebFeature[] }
  usps: {
    title: string
    test: { title: string; text: string; sizes: number[]; unitWord: string; testWord: string; breakAfter?: number; breakLabel?: string }
    report: { title: string; text: string; rows: string[] }
  }
  video: { title: string; id: string; caption: string; duration: string; poster: string }
  pricing: {
    basis: string
    plans: { k: string; v: string; save?: string; best?: boolean }[]
    note?: string
    trial: string
    material: string
  }
}

/** Tách chuỗi có [[...]] thành các đoạn thường / đoạn được tô. */
export function splitMarks(s: string): { t: string; mark: boolean }[] {
  return s
    .split(/(\[\[[^\]]+\]\])/)
    .filter(Boolean)
    .map((p) => (p.startsWith('[[') ? { t: p.slice(2, -2), mark: true } : { t: p, mark: false }))
}

/* ── Giáo viên (dùng lại ở nhiều khoá) ── */
// Cô Thư: theo SOP tư vấn (IELTS 7.5, học trò cũ của thầy, CLB tiếng Anh riêng hơn 3 năm); ảnh Long gửi 16/11/2026.
export const coThu: Teacher = {
  id: 'co-thu',
  name: 'Cô Thư',
  badge: 'IELTS 7.5',
  photo: '/teachers/co-thu.jpg',
  photoAlt: 'Ảnh cô Thư',
  points: ['Học trò cũ của thầy Long.', 'Có câu lạc bộ tiếng Anh riêng hơn 3 năm.'],
}
// Cô Châu: theo CV cô gửi (IELTS Academic 6.5: Reading 9.0, Listening 8.5; TESOL 120 giờ); ảnh Long gửi 16/11/2026.
export const coChau: Teacher = {
  id: 'co-chau',
  name: 'Cô Châu',
  badge: 'Reading 9.0 · Listening 8.5',
  photo: '/teachers/co-chau.jpg',
  photoAlt: 'Ảnh cô Châu',
  points: [
    'IELTS Academic 6.5, mạnh nhất Reading 9.0 và Listening 8.5.',
    'Chứng chỉ TESOL 120 giờ.',
    'Từng dạy Global Success, Cambridge PET, Pre-IELTS và IELTS.',
  ],
}

// Cô Tiên: theo kịch bản tư vấn 24/10/2026 (bản đủ, Long chọn 16/11/2026). Ảnh: chờ Long gửi (đang hiện chữ cái đầu).
export const coTien: Teacher = {
  id: 'co-tien',
  name: 'Cô Tiên',
  badge: 'Hơn 15 năm đứng lớp',
  photoAlt: 'Ảnh cô Tiên',
  points: [
    'Tiếng Anh trình độ C1, giáo viên dạy giỏi cấp tỉnh Lâm Đồng năm học 2024-2025.',
    'Thạc sĩ Ngôn ngữ Anh, thủ khoa khoá 2021-2023.',
    'Có 2 bài nghiên cứu đăng quốc tế.',
  ],
}

/** Ba dòng của phiếu báo cáo tháng (minh hoạ, không số liệu). */
export const REPORT_ROWS = ['Số buổi đi học', 'Tỉ lệ nộp bài', 'Điểm kiểm tra', 'Nhận xét của giáo viên']
