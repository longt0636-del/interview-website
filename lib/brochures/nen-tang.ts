// Brochure IELTS Nền Tảng (mất gốc → 4.0), thay Canva canva.link/d55b4f4fjkcghlc (DAHK0SMiSBA). Long 16/11/2026.
// Số liệu: slide mở đầu Unit 1 Nền Tảng (dựng lại 09/11/2026: Kỳ 1 = 12 unit × 2 buổi + 4 test; Kỳ 2 = 8 unit × 2 buổi
// + 2 test + buổi tổng kết = 47 buổi, 6 tháng), Sổ tay GV Nền Tảng (90 phút/buổi), chính sách học phí 03/07/2026,
// kịch bản tư vấn 24/10 (cô Tiên), app ôn từ vựng (315 từ Unit 1-12). Long chốt: "lớp 8, 9 hoặc mất gốc"; video cả lớp.
import { REPORT_ROWS, coThu, coTien, type Brochure } from './shared'

export const nenTang: Brochure = {
  slug: 'nen-tang',
  path: '/khoa-hoc/nen-tang',
  pdf: '/brochure/ielts-nen-tang-3-4.pdf',
  metaTitle: 'IELTS Nền Tảng · Brochure khoá học · LongIELTS',
  metaDesc:
    'Xây lại từ vựng, ngữ pháp, phát âm từ đầu. Dành cho học sinh lớp 8, 9 hoặc mất gốc. 6 tháng, 47 buổi, học thử 2 buổi miễn phí.',
  ogTitle: 'Brochure khoá IELTS Nền Tảng · LongIELTS',
  ogDesc: 'Lớp 8, 9 hoặc mất gốc tiếng Anh. Học 6 tháng, mỗi unit 2 buổi, học thử 2 buổi miễn phí.',
  hero: {
    eyebrow: 'LongIELTS · Brochure khoá học',
    title: 'IELTS Nền Tảng',
    from: 'Mất gốc',
    to: '4.0',
    sub: 'Xây lại từ vựng, ngữ pháp, phát âm từ đầu. Dành cho học sinh lớp 8, 9 hoặc mất gốc.',
    numeral: '4.0',
  },
  forWho: {
    title: 'Khoá này dành cho ai',
    line1: 'Học sinh [[lớp 8, 9]] hoặc [[mất gốc]] tiếng Anh.',
    line2: 'Học trong [[6 tháng]]: 47 buổi, 2 buổi mỗi tuần, 90 phút mỗi buổi.',
    timeline: {
      caption: 'Lộ trình LongIELTS từ mất gốc',
      segs: [
        { months: 6, kind: 'course', label: 'Nền Tảng · 6 tháng · mất gốc → 4.0' },
        { months: 6, kind: 'after', label: 'Căn Bản · 4.0 → 5.0' },
        { months: 17, kind: 'after', label: 'Road to IELTS · 5.0 → 6.0+' },
      ],
      ends: [
        { at: 0, label: 'Bắt đầu' },
        { at: 6, label: '6 tháng' },
        { at: 12, label: '1 năm' },
        { at: 29, label: 'khoảng 2,5 năm' },
      ],
    },
  },
  founderRole: 'Soạn giáo trình, ra đề kiểm tra, duyệt báo cáo tháng',
  founderCreds: [
    'IELTS Academic 8.5, thi ngày 01/07/2025.',
    'Chứng chỉ TESOL 120 giờ (International TEFL & TESOL Training).',
    'Dạy IELTS từ 2018. Soạn giáo trình và đề kiểm tra của khoá.',
  ],
  // Ảnh chân dung Long gửi 17/11/2026 (thay ảnh đứng cạnh màn chiếu).
  founderPhoto: {
    src: '/teachers/thay-long.jpg',
    alt: 'Thầy Trần Nhật Long mặc vest xanh navy, giơ ngón tay cái',
    caption: 'Thầy Trần Nhật Long, IELTS 8.5.',
  },
  teamTitle: 'Đứng lớp cùng thầy',
  teachers: [coTien, { ...coThu, points: [...coThu.points, 'Đang dạy lớp Nền Tảng 5.'] }],
  teachersNote: 'Hai cô dạy theo đúng giáo trình và đề kiểm tra thầy soạn.',
  sessionsTitle: 'Mỗi unit, 2 buổi',
  sessionLabel: 'Buổi',
  sessions: [
    { n: '1', title: 'Từ vựng + Ngữ pháp', sub: 'Học từ qua câu trả lời mẫu, ngữ pháp theo tình huống.', arts: ['flashcard', 'grammar'] },
    { n: '2', title: 'Nói + Phát âm', sub: 'Luyện Speaking Part 1 theo công thức, nghe đọc, phát âm IPA.', arts: ['speak', 'ipa'] },
  ],
  artText: {
    front: 'free time',
    back: 'thời gian rảnh',
    gram: ['I ', 'prefer tea to', ' coffee.'],
    speakQ: 'Do you prefer tea or coffee?',
  },
  web: {
    title: 'Trang học riêng',
    lead: 'Bài nghe đọc, phát âm, từ vựng và bài nói làm trên [[longielts.website]], mở bằng điện thoại.',
    features: [
      { title: 'Viết câu trả lời rồi nói', text: 'Em viết câu trả lời theo khung của lớp, rồi ghi âm từng câu trên web.', scene: 'speak' },
      { title: 'Nộp xong là biết câu nào sai', text: 'Bài nghe đọc, phát âm, từ vựng có điểm và lời giải ngay.', scene: 'quiz' },
      { title: 'Ôn từ vựng như chơi game', text: '315 từ của 12 unit Kỳ 1 có sẵn trong app ôn từ vựng.', scene: 'vocab' },
    ],
  },
  usps: {
    title: 'Hai điều phụ huynh yên tâm',
    test: {
      title: 'Kiểm tra sau mỗi 3-4 unit',
      text: 'Kỳ 1 có 4 bài (từ vựng, nghe, phát âm, dịch, nói), Kỳ 2 có 2 bài. Trước mỗi bài Kỳ 1 có phần ôn tập trên web.',
      sizes: [3, 3, 3, 3, 4, 4],
      unitWord: 'Unit',
      testWord: 'Test',
      breakAfter: 4,
      breakLabel: 'Kỳ 2',
    },
    report: {
      title: 'Báo cáo mỗi tháng',
      text: 'Cuối tháng phụ huynh nhận báo cáo qua Zalo. Con chưa nộp bài, giáo viên nhắn ngay.',
      rows: REPORT_ROWS,
    },
  },
  video: {
    title: 'Học viên nói gì',
    id: 'class-share',
    caption: 'Học viên LongIELTS kể lại những gì đã học được trong 1 năm.',
    duration: '2:20',
    poster: '/students/poster-students-share.jpg',
  },
  pricing: {
    basis: 'Lớp 2 buổi/tuần, 8 buổi/tháng',
    plans: [
      { k: 'Gói 1 tháng', v: '1.200.000đ' },
      { k: 'Gói 2 tháng', v: '2.200.000đ', save: 'Bớt 200.000đ' },
      { k: 'Gói 3 tháng', v: '3.200.000đ', save: 'Bớt 400.000đ', best: true },
    ],
    trial: 'Học thử 2 buổi miễn phí, học xong mới đóng học phí.',
    material: 'Tài liệu 100.000đ, đóng một lần khi vào học.',
  },
}
