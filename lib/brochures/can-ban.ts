// Brochure IELTS Căn Bản 4.0-5.0 (thay Canva DAG2BsuxsLU). Bản 2 theo noticing, Long 16/11/2026.
// Số liệu: Master Plan "IELTS Căn Bản 4.0-5.0 (3 buổi/unit)" (Kỳ 1: 12 unit × 3 buổi + 4 test = 40 buổi; Kỳ 2: 9 buổi),
// chính sách học phí 03/07/2026, CV cô Châu. Buổi 2 thêm Đọc (Long nói 16/11/2026).
import { REPORT_ROWS, coChau, coThu, type Brochure } from './shared'

export const canBan: Brochure = {
  slug: 'can-ban',
  path: '/khoa-hoc/can-ban',
  pdf: '/brochure/ielts-can-ban-4-5.pdf',
  metaTitle: 'IELTS Căn Bản 4.0-5.0 · Brochure khoá học · LongIELTS',
  metaDesc:
    'Ôn chắc ngữ pháp đã học, rồi dùng được nó khi nói và viết. Dành cho học sinh lớp 10, 11. Khoảng 6 tháng, 49 buổi, học thử 2 buổi miễn phí.',
  ogTitle: 'Brochure khoá IELTS Căn Bản 4.0-5.0 · LongIELTS',
  ogDesc: 'Lớp 10, 11 còn 1-2 năm chuẩn bị IELTS. Học khoảng 6 tháng, mỗi unit 3 buổi, học thử 2 buổi miễn phí.',
  hero: {
    eyebrow: 'LongIELTS · Brochure khoá học',
    title: 'IELTS Căn Bản',
    from: '4.0',
    to: '5.0',
    sub: 'Ôn chắc ngữ pháp đã học, rồi dùng được nó khi nói và viết. Dành cho học sinh lớp 10, 11.',
    numeral: '5.0',
  },
  forWho: {
    title: 'Khoá này dành cho ai',
    line1: 'Học sinh [[lớp 10, 11]] còn [[1-2 năm]] để chuẩn bị IELTS.',
    line2: 'Học trong [[khoảng 6 tháng]]: 49 buổi, 2 buổi mỗi tuần, 90 phút mỗi buổi.',
    timeline: {
      caption: '1-2 năm chuẩn bị IELTS',
      segs: [
        { months: 6, kind: 'course', label: 'Căn Bản · 6 tháng · 4.0 → 5.0' },
        { months: 18, kind: 'after', label: 'Học tiếp Road to IELTS · 5.0 → 6.0+' },
      ],
      ends: [
        { at: 0, label: 'Bắt đầu' },
        { at: 6, label: '6 tháng' },
        { at: 12, label: '1 năm' },
        { at: 24, label: '2 năm' },
      ],
    },
  },
  founderRole: 'Soạn toàn bộ chương trình',
  founderCreds: [
    'IELTS Academic 8.5, thi ngày 01/07/2025.',
    'Chứng chỉ TESOL 120 giờ (International TEFL & TESOL Training).',
    'Dạy IELTS từ 2018. Soạn giáo trình, giáo án, slide và bài kiểm tra của khoá.',
  ],
  founderPhoto: {
    src: '/students/class-photo-3.jpg',
    alt: 'Thầy Long đứng cạnh màn chiếu bảng điểm IELTS của mình',
    caption: 'Thầy Long và bảng điểm IELTS trên màn chiếu.',
  },
  teamTitle: 'Đứng lớp cùng thầy',
  teachers: [
    { ...coThu, points: [...coThu.points, 'Đang dạy lớp Căn Bản 3.'] },
    coChau,
  ],
  teachersNote: 'Hai cô dạy theo đúng giáo án và slide thầy soạn.',
  sessionsTitle: 'Mỗi unit, 3 buổi',
  sessionLabel: 'Buổi',
  sessions: [
    { n: '1', title: 'Từ vựng + Nghe', arts: ['flashcard', 'wave'] },
    { n: '2', title: 'Ngữ pháp + Đọc', isNew: 'Đọc', arts: ['grammar', 'read'] },
    { n: '3', title: 'Thực hành', sub: 'Bài tập thực hành Viết, Nói, Phát âm', arts: ['pen', 'ship'] },
  ],
  web: {
    title: 'Trang học riêng',
    lead: 'Bài về nhà làm và nộp trên [[longielts.website]], mở bằng điện thoại là học được.',
    features: [
      { title: 'Thầy cô sửa ngay trên bài viết', text: 'Chỗ sai được tô màu, bấm vào là thấy vì sao sai và gợi ý sửa.', scene: 'writing' },
      { title: 'Em nói, bài tự thành chữ', text: 'Bài nói ghi âm trên web, máy chép thành chữ để thầy cô chấm.', scene: 'speak' },
      { title: 'Nộp xong là biết câu nào sai', text: 'Bài nghe, từ vựng, ngữ pháp có điểm và lời giải ngay.', scene: 'quiz' },
      { title: 'Ôn từ vựng như chơi game', text: 'Từ của từng unit có trong app ôn từ vựng.', scene: 'vocab' },
    ],
  },
  usps: {
    title: 'Hai điều phụ huynh yên tâm',
    test: {
      title: 'Kiểm tra sau mỗi 3 unit',
      text: 'Bài kiểm tra 90 phút gồm nghe, ngữ pháp, từ vựng và nói. Đề cương ôn tập gửi trước một buổi.',
      sizes: [3, 3, 3, 3],
      unitWord: 'Unit',
      testWord: 'Test',
    },
    report: {
      title: 'Báo cáo mỗi tháng',
      text: 'Cuối tháng phụ huynh nhận báo cáo qua Zalo. Con chưa nộp bài, giáo viên nhắn ngay.',
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
      { k: 'Gói 1 tháng', v: '1.200.000đ' },
      { k: 'Gói 2 tháng', v: '2.200.000đ', save: 'Bớt 200.000đ' },
      { k: 'Gói 3 tháng', v: '3.200.000đ', save: 'Bớt 400.000đ', best: true },
    ],
    trial: 'Học thử 2 buổi miễn phí, học xong mới đóng học phí.',
    material: 'Tài liệu 100.000đ, đóng một lần khi vào học.',
  },
}
