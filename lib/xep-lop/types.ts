// Bài kiểm tra XẾP LỚP theo cấp (16–17/11/2026): Nền Tảng 3-4, Căn Bản 4-5, Complete 5-6 + phần nâng cao 4-5 / phần thêm 5-6.
// Nội dung từng bài ở content-*.ts do script AIOS `teaching/general/test-xep-lop/xuat_web.py` sinh ra từ file đề gốc
// (KHÔNG sửa tay ở đây — sửa đề trong AIOS rồi chạy lại script). Thiết kế + đáp án: bản giáo viên trên Google Drive.
import type { TestSection } from '@/lib/test2-content'

/** Mã bài: 34 / 45 / 56 = bài chính; 451 = phần nâng cao 4-5; 561 = phần thêm 5-6. Trùng với đường dẫn /test/<mã>. */
export type XepLopCode = 34 | 45 | 56 | 451 | 561

/** Phần tự chấm (Nghe, Đọc, trắc nghiệm…) — dựng bằng khung ReadingListeningExercise có sẵn. */
export interface AutoPart {
  section: TestSection
  /** Cột điểm trong sổ: nghe → L, doc → K, ngu-phap → G, tu-vung → H. */
  category: 'nghe' | 'doc' | 'ngu-phap' | 'tu-vung'
}

export interface OpenItem {
  id: string // ví dụ "D1", "10", "36"
  prompt: string // câu hỏi / câu cần sửa / câu tiếng Việt cần dịch ('' nếu chỉ là dòng chép)
  hint?: string // ví dụ "(Yêu cầu: hiện tại hoàn thành + for)" hoặc "(DECIDE)"
}

/** Phần thầy chấm: trả lời ngắn từng dòng, hoặc một bài viết dài. */
export interface OpenTask {
  id: string
  title: string
  instruction: string
  kind: 'short' | 'long'
  items: OpenItem[] // kind 'long' dùng items[0].prompt làm đề
  minWords?: number
  maxWords?: number
  audioSrc?: string // ví dụ phần chép chính tả có file nghe riêng
  bullets?: string[] // gợi ý / câu hỏi gợi ý
  /** Cột trong sổ: viết → N (gộp mọi phần thầy chấm), riêng phần "ngu-phap" vẫn ghi vào N nhưng tính vào mục Ngữ pháp. */
  category: 'viet' | 'ngu-phap' | 'tu-vung' | 'nghe'
}

export interface SpeakingItem {
  id: string
  prompt: string
  note?: string // "khoảng 20–30 giây"
  cueCard?: string[] // dòng "You should say: …"
  prepSeconds?: number
  maxSeconds: number
}

export interface XepLopTest {
  code: XepLopCode
  title: string
  sheetLabel: string // ghi vào cột F "LOẠI BÀI TEST"
  timeLabel: string
  intro: string[]
  parts: Array<{ type: 'auto'; part: AutoPart } | { type: 'open'; task: OpenTask }>
  speaking: SpeakingItem[]
}
