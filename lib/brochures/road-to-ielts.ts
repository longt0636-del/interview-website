// Brochure Road to IELTS (5.0 → 6.0-7.0+), thay Canva canva.link/iqi67oe336pt5h0 (DAG2BtdxhVM). Long 16/11/2026.
// Số liệu: Master Plan tab "Complete IELTS 5-6" đọc 16/11/2026 (138 buổi, Kỳ 1-4, 6 bài thi cuối chặng ở buổi 20, 45, 75,
// 103, 122, 138; Kỳ 1 xoay vòng Writing → Listening → Reading + từ vựng → Speaking), chính sách học phí 03/07/2026
// (Complete 187.500đ/buổi; tăng cường 3 buổi/tuần). Long chốt 16/11: KHÔNG hứa band, chỉ ghi mục tiêu 6.0-7.0+.
// Thầy Long trực tiếp dạy các lớp Complete IELTS. Trang học: chấm Writing bằng máy theo 4 tiêu chí, thầy duyệt lại.
import { REPORT_ROWS, type Brochure } from './shared'

export const roadToIelts: Brochure = {
  slug: 'road-to-ielts',
  path: '/khoa-hoc/road-to-ielts',
  pdf: '/brochure/ielts-road-to-ielts-5-6.pdf',
  metaTitle: 'Road to IELTS 5.0-6.0+ · Brochure khoá học · LongIELTS',
  metaDesc:
    'Cách làm từng dạng bài và luyện đề như thi thật. Dành cho học sinh quanh band 5.0, mục tiêu 6.0-7.0+. Học thử 2 buổi miễn phí.',
  ogTitle: 'Brochure khoá Road to IELTS 5.0-6.0+ · LongIELTS',
  ogDesc: 'Lớp 11 hoặc lớp 10 học sớm, quanh band 5.0. Thầy Long trực tiếp dạy, học thử 2 buổi miễn phí.',
  hero: {
    eyebrow: 'LongIELTS · Brochure khoá học',
    title: 'Road to IELTS',
    from: '5.0',
    to: '6.0+',
    sub: 'Cách làm từng dạng bài và luyện đề như thi thật. Dành cho học sinh quanh band 5.0.',
    numeral: '6.0',
  },
  forWho: {
    title: 'Khoá này dành cho ai',
    line1: 'Học sinh [[lớp 11]] hoặc lớp 10 học sớm, đang quanh [[band 5.0]].',
    line2: 'Học khoảng [[1,5 năm]]: 138 buổi, 2 buổi mỗi tuần, 90 phút mỗi buổi. Mục tiêu 6.0-7.0+.',
    timeline: {
      caption: 'Lộ trình LongIELTS',
      segs: [
        { months: 6, kind: 'before', label: 'Nền Tảng · mất gốc → 4.0' },
        { months: 6, kind: 'before', label: 'Căn Bản · 4.0 → 5.0' },
        { months: 17, kind: 'course', label: 'Road to IELTS · khoảng 1,5 năm · 5.0 → 6.0-7.0+' },
      ],
      ends: [
        { at: 0, label: 'Mất gốc' },
        { at: 12, label: 'Band 5.0' },
        { at: 29, label: 'Mục tiêu 6.0-7.0+' },
      ],
    },
  },
  founderRole: 'Trực tiếp đứng lớp và soạn chương trình',
  founderCreds: [
    'IELTS Academic 8.5, thi ngày 01/07/2025.',
    'Chứng chỉ TESOL 120 giờ (International TEFL & TESOL Training).',
    'Dạy IELTS từ 2018. Trực tiếp dạy và chấm bài các lớp Road to IELTS.',
  ],
  founderPhoto: {
    src: '/students/class-photo-3.jpg',
    alt: 'Thầy Long đứng cạnh màn chiếu bảng điểm IELTS của mình',
    caption: 'Thầy Long và bảng điểm IELTS trên màn chiếu.',
  },
  teachers: [],
  sessionsTitle: 'Mỗi vòng 4 buổi, đủ 4 kỹ năng',
  sessionLabel: 'Buổi',
  sessions: [
    { n: '1', title: 'Writing', sub: 'Task 1 đủ các dạng biểu đồ, Task 2 đủ các dạng đề.', arts: ['chart', 'essay'] },
    { n: '2', title: 'Listening', sub: 'Đề thật Cambridge, chữa từng câu bằng câu trích từ bài nghe.', arts: ['wave'] },
    { n: '3', title: 'Reading + Từ vựng', sub: 'Cách làm từng dạng câu hỏi, từ vựng học thuật.', arts: ['read', 'flashcard'] },
    { n: '4', title: 'Speaking', sub: 'Part 1, 2, 3, luyện theo đề dự đoán.', arts: ['speak'] },
  ],
  artText: {
    front: 'sustainable',
    back: 'bền vững',
    speakQ: 'Describe a place you would like to visit.',
  },
  web: {
    title: 'Trang học riêng',
    lead: 'Bài về nhà làm và nộp trên [[longielts.website]], bài viết có điểm band ngay.',
    features: [
      { title: 'Bài viết có điểm band và nhận xét', text: 'Máy chấm theo 4 tiêu chí IELTS, thầy đọc lại và duyệt trước khi trả bài.', scene: 'writing' },
      { title: 'Em nói, bài tự thành chữ', text: 'Ghi âm từng câu trên web, máy chép thành chữ và tô chỗ cần sửa.', scene: 'speak' },
      { title: 'Nộp xong là biết câu nào sai', text: 'Đề Reading, Listening có lời giải từng câu, trích đúng câu trong bài.', scene: 'quiz' },
      { title: 'Ôn từ vựng như chơi game', text: 'App ôn từ vựng có bảng xếp hạng cả lớp.', scene: 'vocab' },
    ],
  },
  usps: {
    title: 'Hai điều phụ huynh yên tâm',
    test: {
      title: 'Thi cuối mỗi chặng',
      text: '6 bài thi trong khoá, đủ Nghe, Đọc, Viết, Nói, tính giờ như thi thật.',
      sizes: [1, 1, 1, 1, 1, 1],
      unitWord: 'Chặng',
      testWord: 'Test',
    },
    report: {
      title: 'Báo cáo mỗi tháng',
      text: 'Cuối tháng phụ huynh nhận báo cáo qua Zalo. Con chưa nộp bài, thầy nhắn ngay.',
      rows: REPORT_ROWS,
    },
  },
  video: {
    title: 'Học viên nói gì',
    id: 'ngoc-lan',
    caption: 'Trương Ngọc Lan, IELTS 7.5: từ mất gốc Reading đến band 7.5.',
    duration: '4:46',
    poster: '/students/poster-lan.jpg',
  },
  pricing: {
    basis: 'Lớp 2 buổi/tuần, 8 buổi/tháng',
    plans: [
      { k: 'Gói 1 tháng', v: '1.500.000đ' },
      { k: 'Gói 2 tháng', v: '2.800.000đ', save: 'Bớt 200.000đ' },
      { k: 'Gói 3 tháng', v: '4.000.000đ', save: 'Bớt 500.000đ', best: true },
    ],
    note: 'Lớp tăng cường 3 buổi/tuần: 2.250.000đ/tháng.',
    trial: 'Học thử 2 buổi miễn phí, học xong mới đóng học phí.',
    material: 'Tài liệu 100.000đ, đóng một lần khi vào học.',
  },
}
