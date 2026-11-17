// Gợi ý lớp TẠM cho bài xếp lớp (17/11/2026) — chỉ dựa trên phần máy chấm (Nghe, Đọc, trắc nghiệm, điền).
// Viết, Nói, chép chính tả, sửa lỗi, dịch: thầy chấm sau, nên gợi ý luôn ghi "tạm". Ngưỡng lấy từ bản giáo viên
// trên Google Drive (mục 6) và sẽ đặt lại sau khi chạy thử với lớp thật.
import type { LevelFeedback } from '@/lib/test-logic'

export interface Diem {
  score: number
  total: number
}

export interface XepLopPayload {
  code: number
  /** Điểm phần máy chấm theo mục: nghe / doc / ngu-phap / tu-vung */
  categories: Partial<Record<'nghe' | 'doc' | 'ngu-phap' | 'tu-vung', Diem>>
  /** Điểm theo nhóm câu: 'san' (3-4: câu 1–5 + 16–19), 'thi-kho' (4-5: câu 18, 21, 23), 'm2' 'm3' 'm4' (phần nâng cao). */
  groups?: Record<string, Diem>
}

export interface GoiY {
  suggestedClass: string
  detail: string
  feedback: LevelFeedback
}

const NT = 'IELTS Nền Tảng (Trình độ 3-4)'
const CB = 'IELTS Căn Bản (Trình độ 4-5)'
const CI = 'Complete IELTS (Trình độ 5-6+)'
const NHAN: Record<string, string> = { nghe: 'Nghe', doc: 'Đọc', 'ngu-phap': 'Ngữ pháp', 'tu-vung': 'Từ vựng' }

const f = (d?: Diem) => (d ? `${d.score}/${d.total}` : '—')
const s = (d?: Diem) => d?.score ?? 0

export function goiYXepLop(p: XepLopPayload): GoiY {
  const c = p.categories || {}
  const g = p.groups || {}
  const parts = (Object.keys(NHAN) as Array<keyof typeof NHAN>)
    .filter((k) => c[k as keyof typeof c])
    .map((k) => `${NHAN[k]} ${f(c[k as keyof typeof c])}`)
  const tong = Object.values(c).reduce((a, d) => ({ score: a.score + (d?.score ?? 0), total: a.total + (d?.total ?? 0) }), {
    score: 0,
    total: 0,
  })
  let lop = CB
  let note = ''
  let feedback: LevelFeedback = { headline: 'Kết quả đã ghi nhận', detail: 'Thầy cô sẽ xem phần Viết và Nói rồi gọi tư vấn lớp phù hợp.' }

  if (p.code === 34) {
    lop = NT
    const san = g['san']
    if (tong.score <= 14 && s(san) <= 4) {
      note = 'gợi ý lớp Nền Tảng đi chậm (tổng thấp + câu sàn thấp)'
      feedback = { headline: 'Bắt đầu chậm mà chắc', detail: 'Em nên học lại từ những phần rất cơ bản. Thầy cô sẽ có kế hoạch kèm thêm trong vài tuần đầu.' }
    } else if (tong.score >= 34) {
      note = 'làm gần trọn đề: xem Viết + Nói, cân nhắc mời làm bài 4-5'
      feedback = { headline: 'Nền tảng khá vững', detail: 'Em làm tốt phần Nghe và Đọc. Thầy cô xem thêm phần Viết, Nói để chọn lớp vừa sức nhất.' }
    } else {
      note = tong.score <= 17 || tong.score >= 31 ? 'sát ngưỡng: thầy nghe lại ghi âm, hỏi thêm khi gọi' : ''
      feedback = { headline: 'Sẵn sàng học Nền Tảng', detail: 'Em có thể bắt đầu lớp Nền Tảng 3-4 và theo kịp bài học.' }
    }
    parts.push(`Tổng tự chấm ${f(tong)}`, `Câu sàn ${f(san)}`)
  } else if (p.code === 45) {
    if (tong.score <= 11) {
      lop = NT
      note = 'phần máy chấm thấp: xem câu sửa lỗi + đoạn văn trước khi chốt (có thể lớp Nền Tảng Kỳ 2)'
      feedback = { headline: 'Cần củng cố nền tảng', detail: 'Em nên vững thêm ngữ pháp và từ vựng cơ bản trước khi vào lớp Căn Bản.' }
    } else if (tong.score >= 21) {
      note = `điểm cao: cân nhắc gửi phần nâng cao 4-5 (câu thì khó 18/21/23: ${f(g['thi-kho'])})`
      feedback = { headline: 'Sẵn sàng học Căn Bản', detail: 'Em làm tốt phần chính. Thầy cô có thể gửi thêm phần nâng cao để chọn lớp chính xác hơn.' }
    } else {
      note = 'lớp Căn Bản mới (từ Unit 1)'
      feedback = { headline: 'Vừa sức lớp Căn Bản', detail: 'Em có thể bắt đầu lớp Căn Bản 4-5 từ đầu khoá.' }
    }
    parts.push(`Tổng tự chấm ${f(tong)}`)
  } else if (p.code === 56) {
    lop = CI
    const l = s(c.nghe)
    const r = s(c.doc)
    if (l <= 7 && r <= 5) {
      lop = CB
      note = 'Nghe và Đọc đều thấp: nghiêng về Căn Bản (xem Task 2 trước khi chốt)'
      feedback = { headline: 'Nên vững thêm nền', detail: 'Em nên học lớp Căn Bản trước để chắc ngữ pháp và kỹ năng, rồi lên Complete IELTS.' }
    } else if (l >= 13 && r >= 10) {
      note = 'Nghe + Đọc cao: xem Task 2, cân nhắc phần thêm 20 phút (khối Task 1 / khoá 6-7)'
      feedback = { headline: 'Trình độ khá', detail: 'Em làm rất tốt phần Nghe và Đọc. Thầy cô xem bài viết rồi có thể gửi thêm phần nâng cao.' }
    } else if (l >= 11 && r >= 8) {
      note = 'ngang lớp đang học sau Term Test 1: vào lớp Kỳ 2 nếu Task 2 ≥ 5.5'
      feedback = { headline: 'Sẵn sàng học Complete IELTS', detail: 'Em có thể theo lớp Complete IELTS, có thể vào lớp đang học nếu bài viết tốt.' }
    } else {
      note = l <= 7 || r <= 5 ? 'một kỹ năng thấp: sát ngưỡng, xem Task 2 + Nói' : 'lớp Complete mới (hoặc lớp còn trong 10 buổi đầu)'
      feedback = { headline: 'Vừa sức Complete IELTS', detail: 'Em có thể bắt đầu lớp Complete IELTS từ đầu khoá.' }
    }
  } else if (p.code === 451) {
    lop = CB
    parts.push(`Module 2 ${f(g['m2'])}`, `Module 3 ${f(g['m3'])}`, `Module 4 ${f(g['m4'])}`)
    note =
      s(c.nghe) >= 4 && s(c['ngu-phap']) >= 7
        ? 'đạt phần nâng cao: cân nhắc mời làm bài 5-6'
        : s(g['m3']) >= 2 && s(g['m2']) >= 2
        ? 'có thể vào lớp đang học từ đầu Unit 10 (xem dịch 56–57)'
        : s(g['m2']) >= 2
        ? 'có thể vào lớp đang học từ đầu Unit 7'
        : 'vào lớp đang học từ đầu Unit 4 (nếu phần chính đủ) hoặc lớp mới'
    feedback = { headline: 'Đã nhận phần nâng cao', detail: 'Thầy cô sẽ xem kết quả để chọn đúng lớp Căn Bản cho em.' }
  } else if (p.code === 561) {
    lop = CI
    parts.push(`Tổng ${f(tong)}`)
    note =
      tong.score >= 11
        ? 'phần thêm ≥ 75%: xét khoá 6-7 nếu Viết ≥ 6.5 và Nói ≥ 6.0'
        : tong.score >= 9
        ? 'có thể vào khối Task 1 (từ buổi 46) nếu Viết ≥ 6.0'
        : 'giữ lớp Complete theo bài chính'
    feedback = { headline: 'Đã nhận phần thêm', detail: 'Thầy cô sẽ xem kết quả để chọn đúng lớp cho em.' }
  }

  const detail = `${parts.join(' · ')} | Gợi ý tạm: ${lop}${note ? ` — ${note}` : ''} | Viết, Nói, chép chính tả, sửa lỗi, dịch: thầy chấm`
  return { suggestedClass: lop, detail, feedback }
}
