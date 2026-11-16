// Nội dung brochure khoá IELTS Căn Bản 4.0-5.0. MỘT nguồn cho trang web /khoa-hoc/can-ban và bản in /khoa-hoc/can-ban/in (→ PDF).
// Bản 1 (16/11/2026) thay brochure Canva DAG2BsuxsLU. Bản 2 (16/11/2026, Long): dựa thuyết noticing, ít chữ, chỉ tô đậm
// thông tin chính; chương 1 nhấn lớp 10-11 · còn 1-2 năm · học khoảng 6 tháng; chương 2 thêm ảnh + gạch đầu dòng cô Thư,
// cô Châu; chương 3 chỉ 3 buổi (buổi 2 thêm Đọc, mới); bỏ lộ trình chi tiết + kết quả, thay bằng 3 điểm khác biệt
// (kiểm tra sau mỗi 3 unit, bài về nhà trên web, báo cáo mỗi tháng); học viên = video Ngọc Lan; cuối là học phí.
// Số liệu: Master Plan "IELTS Căn Bản 4.0-5.0 (3 buổi/unit)" + chính sách học phí 03/07/2026 + CV cô Châu (Long gửi 16/11/2026).

export const BROCHURE_FORM_URL =
  'https://docs.google.com/forms/d/1sZbzR4G_j-YYpKKBcQ5bNwHhfQEH9a0k9GaJW4FCtjk/viewform'
export const BROCHURE_PDF = '/brochure/ielts-can-ban-4-5.pdf'
export const ZALO_URL = 'https://zalo.me/0367832164'
export const ZALO_DISPLAY = '036 783 2164'
export const ADDRESS = '289/26 Hồ Tùng Mậu, Bảo Lộc'
export const UPDATED = '11/2026'

export const hero = {
  eyebrow: 'LongIELTS · Brochure khoá học',
  title: 'IELTS Căn Bản',
  from: '4.0',
  to: '5.0',
  sub: 'Ôn chắc ngữ pháp đã học, rồi dùng được nó khi nói và viết. Dành cho học sinh lớp 10, 11.',
}

/* Chương 1: chỉ hai câu, ba cụm được tô (noticing). Chuỗi [[...]] là phần tô. */
export const forWho = {
  title: 'Khoá này dành cho ai',
  line1: 'Học sinh [[lớp 10, 11]] còn [[1-2 năm]] để chuẩn bị IELTS.',
  line2: 'Học trong [[khoảng 6 tháng]]: 49 buổi, 2 buổi mỗi tuần, 90 phút mỗi buổi.',
  timeline: {
    total: '1-2 năm chuẩn bị IELTS',
    course: 'Căn Bản · 6 tháng · 4.0 → 5.0',
    after: 'Học tiếp Road to IELTS · 5.0 → 6.0+',
  },
}

export const founder = {
  name: 'Thầy Trần Nhật Long',
  role: 'Soạn toàn bộ chương trình',
  testDate: '01/07/2025',
  scores: [
    { k: 'Listening', v: '9.0' },
    { k: 'Reading', v: '9.0' },
    { k: 'Writing', v: '7.5' },
    { k: 'Speaking', v: '7.5' },
  ],
  overall: '8.5',
  creds: [
    'IELTS Academic 8.5, thi ngày 01/07/2025.',
    'Chứng chỉ TESOL 120 giờ (International TEFL & TESOL Training).',
    'Dạy IELTS từ 2018. Soạn giáo trình, giáo án, slide và bài kiểm tra của khoá.',
  ],
  photoAlt: 'Thầy Long đứng cạnh màn chiếu bảng điểm IELTS của mình',
  photoCaption: 'Thầy Long và bảng điểm IELTS trên màn chiếu.',
}

export type Teacher = {
  id: string
  name: string
  badge: string
  photo?: string
  photoAlt: string
  points: string[]
}

// Cô Châu: theo CV cô gửi (IELTS Academic 6.5: Reading 9.0, Listening 8.5, Speaking 6.5, Writing 6.5; TESOL 120 giờ).
// Cô Thư: theo SOP tư vấn (IELTS 7.5, học trò cũ của thầy, CLB tiếng Anh riêng hơn 3 năm). Ảnh cô Thư: chờ Long gửi.
export const teachers: Teacher[] = [
  {
    id: 'co-thu',
    name: 'Cô Thư',
    badge: 'IELTS 7.5',
    photoAlt: 'Ảnh cô Thư',
    points: ['Học trò cũ của thầy Long.', 'Có câu lạc bộ tiếng Anh riêng hơn 3 năm.', 'Đang dạy lớp Căn Bản 3.'],
  },
  {
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
  },
]
export const teachersNote = 'Hai cô dạy theo đúng giáo án và slide thầy soạn.'

/* Chương 3: không cần câu dẫn, chỉ 3 buổi. */
export const sessions = [
  { n: '1', title: 'Từ vựng + Nghe', isNew: '', sub: '' },
  { n: '2', title: 'Ngữ pháp + Đọc', isNew: 'Đọc', sub: '' },
  { n: '3', title: 'Thực hành', isNew: '', sub: 'Bài tập thực hành Viết, Nói, Phát âm' },
]

/* Chương 4: ba điểm khác biệt, mỗi điểm có hình hoặc chuyển động làm bằng chứng. */
export const usps = {
  title: 'Ba điều phụ huynh yên tâm',
  test: {
    title: 'Kiểm tra sau mỗi 3 unit',
    text: 'Bài kiểm tra 90 phút gồm nghe, ngữ pháp, từ vựng và nói. Đề cương ôn tập gửi trước một buổi.',
  },
  web: {
    title: 'Bài về nhà trên web',
    text: 'Làm và nộp ngay trên điện thoại. Bài nghe, từ vựng, ngữ pháp có điểm ngay, bài nói và bài viết có nhận xét.',
  },
  report: {
    title: 'Báo cáo mỗi tháng',
    text: 'Cuối tháng phụ huynh nhận báo cáo qua Zalo. Con chưa nộp bài, giáo viên nhắn ngay.',
    rows: ['Số buổi đi học', 'Tỉ lệ nộp bài', 'Điểm kiểm tra', 'Nhận xét của giáo viên'],
  },
}

export const lan = {
  title: 'Học viên nói gì',
  caption: 'Trương Ngọc Lan, IELTS 7.5: từ mất gốc Reading đến band 7.5.',
  poster: '/students/poster-lan.jpg',
  duration: '4:46',
}

export const pricing = {
  basis: 'Lớp 2 buổi/tuần, 8 buổi/tháng',
  plans: [
    { k: 'Gói 1 tháng', v: '1.200.000đ', save: '' },
    { k: 'Gói 2 tháng', v: '2.200.000đ', save: 'Bớt 200.000đ' },
    { k: 'Gói 3 tháng', v: '3.200.000đ', save: 'Bớt 400.000đ', best: true },
  ],
  trial: 'Học thử 2 buổi miễn phí, học xong mới đóng học phí.',
  material: 'Tài liệu 100.000đ, đóng một lần khi vào học.',
}

/** Tách chuỗi có [[...]] thành các đoạn thường / đoạn được tô. */
export function splitMarks(s: string): { t: string; mark: boolean }[] {
  return s
    .split(/(\[\[[^\]]+\]\])/)
    .filter(Boolean)
    .map((p) => (p.startsWith('[[') ? { t: p.slice(2, -2), mark: true } : { t: p, mark: false }))
}
