// Nội dung brochure khoá IELTS Căn Bản 4.0-5.0 (thay brochure Canva DAG2BsuxsLU, Long 16/11/2026).
// MỘT nguồn cho cả trang web /khoa-hoc/can-ban và bản in A4 /khoa-hoc/can-ban/in (từ đó xuất PDF).
// Số liệu lấy từ Master Plan "IELTS Căn Bản 4.0-5.0 (3 buổi/unit)" (sheet 13TxqDAd…) + chính sách học phí 03/07/2026.
// Long chốt 16/11/2026: viết cho cả học sinh lẫn phụ huynh; học phí gói 1-2-3 tháng; "khoảng 6 tháng, 49 buổi";
// bảng điểm 8.5 là của thầy Long (người soạn chương trình), cô Thư + cô Châu (IELTS 7.5) đứng lớp.
// Sửa nội dung ở đây rồi xuất lại PDF (xem docs trong commit / memory project-brochure-can-ban).

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

export const forWho = {
  lead:
    'Bạn đang học lớp 10 hoặc 11, đã có ngữ pháp và từ vựng căn bản, còn 1 đến 2 năm để chuẩn bị IELTS. Hoặc bạn cần 4.0 đến 5.0 để thi sớm lấy bằng. Viết và nói thường là hai kỹ năng còn yếu nhất.',
  signs: [
    'Ngữ pháp biết rồi, mà nói với viết vẫn sai.',
    'Nghe tiếng Anh chỉ bắt được vài từ.',
    'Viết câu đơn thì được, viết cả đoạn thì bí.',
    'Lên lớp 10, 11 rồi, cần IELTS để xét tuyển.',
  ],
  facts: [
    { k: 'Thời lượng', v: 'Khoảng 6 tháng, 49 buổi' },
    { k: 'Lịch học', v: '2 buổi/tuần, 90 phút/buổi' },
    { k: 'Sĩ số', v: 'Tối đa 10 bạn' },
    { k: 'Học thử', v: '2 buổi đầu, miễn phí' },
  ],
}

export const founder = {
  name: 'Thầy Trần Nhật Long',
  role: 'Người soạn chương trình',
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
    'Chứng chỉ TESOL 120 giờ của International TEFL & TESOL Training (2023).',
    'Dạy IELTS từ 2018: 5 năm ở Bee Center, từ 2023 mở lớp LongIELTS tại Bảo Lộc.',
  ],
  body:
    'Thầy soạn toàn bộ khoá Căn Bản: giáo trình, giáo án từng buổi, slide, bài tập về nhà trên web và các bài kiểm tra định kỳ.',
  teachers:
    'Người đứng lớp là cô Thư và cô Châu, cùng IELTS 7.5. Hai cô dạy theo đúng bộ bài thầy soạn, còn thầy theo dõi sổ dạy và bài tập của từng lớp trên web.',
  photoAlt: 'Thầy Long đứng cạnh màn chiếu bảng điểm IELTS của mình',
  photoCaption: 'Thầy Long và bảng điểm IELTS trên màn chiếu.',
}

export const method = {
  lead:
    'Khoá có 12 unit. Mỗi unit học trong 3 buổi, mỗi buổi 90 phút, và bộ từ của unit được dùng lại ở cả 3 buổi.',
  sessions: [
    {
      n: '1',
      title: 'Từ vựng + Nghe',
      text: 'Học 20 đến 35 từ và cụm từ theo chủ đề, nghe điền từ, chép chính tả.',
    },
    {
      n: '2',
      title: 'Ngữ pháp',
      text: 'Học điểm ngữ pháp của unit và làm bài trên chính bộ từ vừa học. 13 phút đầu buổi dành để kiểm tra và vá lỗi nền.',
    },
    {
      n: '3',
      title: 'Viết + Nói + Phát âm',
      text: 'Dịch đoạn văn từ tiếng Việt sang tiếng Anh, trả lời câu hỏi Speaking của chủ đề, luyện một nhóm âm dễ nhầm theo sách Ship or Sheep.',
    },
  ],
  example: {
    label: 'Ví dụ ở Unit 1, Holidays and Travel',
    words: ['mass tourism', 'air pollution', 'local people'],
    text: 'gặp lần đầu ở buổi 1, quay lại trong bài ngữ pháp buổi 2, rồi nằm trong đoạn văn bạn dịch ở buổi 3.',
  },
  games: 'Buổi nào cũng có trò chơi trên lớp, ví dụ Matching Pairs với từ vựng hay Spot the Error với ngữ pháp.',
}

export type Unit = { n: number; en: string; vi: string; gr: string }
export const stages: { label: string; range: string; units: Unit[]; test: { n: number; at: number } }[] = [
  {
    label: 'Chặng 1',
    range: 'buổi 1-10',
    units: [
      { n: 1, en: 'Holidays and Travel', vi: 'Du lịch', gr: 'Hiện tại đơn, quá khứ đơn, hiện tại hoàn thành' },
      { n: 2, en: 'Free Time', vi: 'Thời gian rảnh', gr: 'Các thì tiếp diễn' },
      { n: 3, en: 'Fame', vi: 'Sự nổi tiếng', gr: 'Quá khứ hoàn thành, used to, would' },
    ],
    test: { n: 1, at: 10 },
  },
  {
    label: 'Chặng 2',
    range: 'buổi 11-20',
    units: [
      { n: 4, en: 'Education', vi: 'Giáo dục', gr: 'Thì tương lai: going to, will' },
      { n: 5, en: 'The Internet', vi: 'Internet', gr: 'Tương lai tiếp diễn, tương lai hoàn thành' },
      { n: 6, en: 'Employment and Finance', vi: 'Việc làm và tài chính', gr: 'Mạo từ a, an, the' },
    ],
    test: { n: 2, at: 20 },
  },
  {
    label: 'Chặng 3',
    range: 'buổi 21-30',
    units: [
      { n: 7, en: 'Crime', vi: 'Tội phạm', gr: 'Động từ khuyết thiếu: can, should, must' },
      { n: 8, en: 'Regret', vi: 'Sự hối tiếc', gr: 'should have, could have, might have' },
      { n: 9, en: 'Globalization', vi: 'Toàn cầu hoá', gr: 'Câu điều kiện loại 0, 1, 2, 3' },
    ],
    test: { n: 3, at: 30 },
  },
  {
    label: 'Chặng 4',
    range: 'buổi 31-40',
    units: [
      { n: 10, en: 'Youth', vi: 'Giới trẻ', gr: 'Từ nối trong bài nói và bài viết' },
      { n: 11, en: 'Films and Books', vi: 'Phim và sách', gr: 'Câu bị động' },
      { n: 12, en: 'Wildlife', vi: 'Động vật hoang dã', gr: 'Mệnh đề quan hệ' },
    ],
    test: { n: 4, at: 40 },
  },
]

export const roadmap = {
  ky1: { title: 'Kỳ 1', meta: '40 buổi · khoảng 5 tháng · 12 unit' },
  testNote:
    'Mỗi bài kiểm tra dài 90 phút, gồm nghe, ngữ pháp, từ vựng và nói. Đề cương ôn tập được gửi ở buổi học ngay trước đó.',
  ky2: {
    title: 'Kỳ 2',
    meta: '9 buổi · luyện 4 kỹ năng IELTS',
    note: 'Mỗi buổi tập trung một kỹ năng và làm quen dạng bài IELTS.',
    sessions: [
      'Listening 1',
      'Speaking 1',
      'Writing 1',
      'Reading 1',
      'Test 5',
      'Listening 2',
      'Writing 2',
      'Reading & Speaking 2',
      'Test 6',
    ],
  },
}

export const outcomes = {
  items: [
    'Ngữ pháp hay gặp trong IELTS: các thì, mạo từ, động từ khuyết thiếu, câu điều kiện, câu bị động, mệnh đề quan hệ.',
    'Gần 300 từ và cụm từ thuộc 12 chủ đề IELTS quen thuộc.',
    'Viết được đoạn văn ngắn đúng ngữ pháp và trả lời câu hỏi Speaking về các chủ đề đã học.',
    'Phát âm đúng 12 nhóm âm dễ nhầm.',
  ],
  target: 'Mục tiêu band 4.0 đến 5.0, đủ nền để học tiếp khoá Road to IELTS (5.0 đến 6.0+).',
}

export const parents = {
  lead: 'Phụ huynh biết con học thế nào qua bài tập trên web, tin nhắn Zalo và báo cáo cuối tháng.',
  items: [
    {
      k: 'Bài về nhà trên web',
      v: 'Sau mỗi buổi, bài về nhà được giao và nộp trên web. Bài nghe, từ vựng, ngữ pháp có điểm ngay, bài nói và bài viết có nhận xét chi tiết.',
    },
    { k: 'Tin nhắn Zalo', v: 'Con chưa nộp bài thì giáo viên nhắn phụ huynh qua Zalo.' },
    {
      k: 'Báo cáo tháng',
      v: 'Cuối tháng phụ huynh nhận báo cáo số buổi đi học, tỉ lệ nộp bài, điểm kiểm tra và nhận xét về con.',
    },
  ],
  ask: 'Phụ huynh giúp lớp nhiều nhất khi nhắc con nộp bài đúng hạn và hỏi con kết quả sau mỗi bài kiểm tra.',
  photoAlt: 'Thầy Long chụp ảnh cùng một lớp học sinh LongIELTS',
  photoCaption: 'Một lớp LongIELTS cùng thầy Long.',
}

export const testimonial = {
  // Trích nguyên văn từ brochure Canva cũ (DAG2BsuxsLU, trang "Học viên nói gì về khoá học").
  quote: [
    'Thay vì nghe những bài giảng nhồi nhét, mỗi buổi học là một trải nghiệm cho mình. Mỗi buổi học đều có mục tiêu rõ ràng, mình luôn biết rõ sau buổi học mình đạt được điều gì, không còn cảm giác mông lung hay "bơi" trong kiến thức.',
    'Ở lớp thầy lúc nào cũng vui vẻ, hài hước, các bạn thì hoà đồng thân thiện, hoàn toàn không có cảm giác gò bó hay áp lực bài tập. Cách thầy lắng nghe, thấu hiểu và phản hồi khiến mình thấy được tôn trọng. Chính sự kết nối này đã giúp mình gỡ bỏ hoàn toàn rào cản tâm lý, học chắc hơn rất nhiều.',
  ],
  name: 'Thùy Trang',
  who: 'Học sinh lớp 12',
  photoAlt: 'Bảng Stars of the Month ở lớp, ảnh Thùy Trang ở mục Hardworking Star',
  photoCaption: 'Thùy Trang trên bảng Stars of the Month, mục Hardworking Star.',
}

export const pricing = {
  basis: 'Lớp 2 buổi/tuần, 8 buổi/tháng',
  plans: [
    { k: 'Gói 1 tháng', v: '1.200.000đ', save: '' },
    { k: 'Gói 2 tháng', v: '2.200.000đ', save: 'Bớt 200.000đ' },
    { k: 'Gói 3 tháng', v: '3.200.000đ', save: 'Bớt 400.000đ', best: true },
  ],
  notes: ['Tài liệu 100.000đ, đóng một lần khi vào học.', 'Học thử 2 buổi miễn phí, học xong mới đóng học phí.'],
}

export const rules = {
  rights: [
    'Hỏi và được giải đáp mọi thắc mắc về bài học và lộ trình.',
    'Góp ý về chương trình học và thời gian học.',
  ],
  duties: [
    'Làm đủ bài tập trước khi đến lớp. Không kịp thì báo giáo viên trước giờ học.',
    'Làm bài trung thực, đúng sức mình, không dùng công nghệ làm hộ.',
  ],
}

export const enrol = {
  steps: [
    'Điền form đăng ký, khoảng 5 phút.',
    'Làm bài kiểm tra trình độ trên web.',
    'Thầy Long liên hệ trong 24 giờ để xếp 2 buổi học thử.',
  ],
}
