// Ba khoá đang tuyển, xếp thành lộ trình từ mất gốc tới 6.0-7.0+ (thay cho 3 thẻ khoá học bấm ra brochure Canva, 26/10/2026).
// Nội dung lấy từ 3 brochure Canva: Foundation 3-4 (DAHK0SMiSBA), IELTS Cơ Bản (DAG2BsuxsLU), Road to IELTS (DAG2BtdxhVM).
// Học phí giữ đúng con số web đang hiện trước đó, riêng giá gốc Road to IELTS theo brochure: 1.750.000đ (Long chốt 26/10/2026).

export type CoursePhase = { title: string; meta?: string; body: string }

export type Course = {
  id: string
  name: string
  /** Band ở đầu và cuối chặng, hiện trên đường lộ trình */
  from: string
  to: string
  tagline: string
  /** Những câu học sinh ở chặng này hay nghĩ trong đầu */
  signs: string[]
  forWho: string
  facts: { label: string; value: string }[]
  phases: CoursePhase[]
  outcomes: string[]
  next?: string
  price: string
  oldPrice: string
  savings: string
  brochure: string
}

export const courses: Course[] = [
  {
    id: 'nen-tang',
    name: 'IELTS Nền Tảng',
    from: '0',
    to: '4.0',
    tagline: 'Học lại từ gốc, chắc từng bước một.',
    signs: [
      'Biết từng từ, ghép thành câu thì bí.',
      'Ngại nói vì sợ phát âm sai.',
      'Ngữ pháp học trên trường xong là quên.',
      'Đang học cấp 2, muốn bắt đầu IELTS sớm.',
    ],
    forWho:
      'Bạn mất gốc hoặc đang quanh 3.0 đến 4.0, và các bạn THCS (lớp 6 đến 9) có nền khá, muốn học IELTS sớm để đi đường dài thay vì luyện cấp tốc năm lớp 12.',
    facts: [
      { label: 'Thời gian', value: '6 tháng, 2 kỳ (khoảng 46 buổi)' },
      { label: 'Lịch học', value: '2 buổi/tuần, 90 phút/buổi' },
      { label: 'Kiểm tra', value: '6 bài test định kỳ' },
      { label: 'Giáo viên', value: 'Cô Hồ Xuân Tiên dạy chính, cùng thầy Long' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    phases: [
      {
        title: 'Kỳ 1',
        meta: '3,5 tháng',
        body: 'Từ vựng theo chủ đề quen thuộc, ngữ pháp tình huống, phát âm IPA cơ bản và 12 dạng câu hỏi Speaking Part 1. Giáo trình Speaking Book và GAF 1, có 4 bài test.',
      },
      {
        title: 'Kỳ 2',
        meta: '2,5 tháng',
        body: 'Ngữ pháp có hệ thống, tự tra word form và phiên âm, nghe đọc qua GAF 2, viết đoạn ngắn và thuyết trình nhóm. Có 2 bài test.',
      },
    ],
    outcomes: [
      'Khoảng 1.500 đến 1.800 từ vựng theo chủ đề',
      'Đọc đúng từ mới nhờ phát âm IPA',
      'Viết đoạn 3 đến 5 câu đúng cấu trúc',
      'Nói 1 đến 2 phút về chủ đề quen thuộc',
    ],
    next: 'Học xong là đủ nền để lên IELTS Căn Bản.',
    price: '1.200.000',
    oldPrice: '1.400.000',
    savings: '200K',
    brochure: 'https://canva.link/d55b4f4fjkcghlc',
  },
  {
    id: 'can-ban',
    name: 'IELTS Căn Bản',
    from: '4.0',
    to: '5.0',
    tagline: 'Đưa ngữ pháp đã học vào câu nói, câu viết.',
    signs: [
      'Ngữ pháp biết rồi, mà nói với viết vẫn sai.',
      'Nghe tiếng Anh chỉ bắt được vài từ.',
      'Viết câu đơn thì được, viết cả đoạn thì bí.',
      'Lên lớp 10, 11 rồi, cần IELTS để xét tuyển.',
    ],
    forWho:
      'Học sinh lớp 10, 11 đã có ngữ pháp và từ vựng căn bản, còn 1 đến 2 năm để chuẩn bị IELTS, hoặc cần 4.0 đến 5.0 để thi sớm lấy bằng. Viết và nói thường là hai kỹ năng còn yếu nhất.',
    facts: [
      { label: 'Thời gian', value: '10 đến 12 tháng, 2 kỳ' },
      { label: 'Lịch học', value: '2 buổi/tuần' },
      { label: 'Kiểm tra', value: '2 đến 4 bài test mỗi kỳ' },
      { label: 'Giáo viên', value: 'Thầy Long' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    phases: [
      {
        title: 'Kỳ 1: Củng cố kiến thức',
        body: 'Ôn lại toàn bộ ngữ pháp theo hướng dùng được, bổ sung từ vựng rồi đưa ngay vào nói và viết. Mỗi tuần nghe điền từ và chép chính tả.',
      },
      {
        title: 'Kỳ 2: Làm quen IELTS',
        body: 'Bắt đầu với 4 kỹ năng IELTS và các dạng bài cơ bản của Reading, Listening, Writing, Speaking.',
      },
      {
        title: 'Một tuần 2 buổi',
        body: 'Buổi 1 học ngữ pháp, từ vựng và làm bài nghe. Buổi 2 chữa bài nghe, luyện phát âm IPA và luyện nói.',
      },
    ],
    outcomes: [
      'Nói và viết được câu hoàn chỉnh',
      'Nghe tốt hơn và vốn từ rộng hơn',
      'Quen các dạng bài IELTS ở mức căn bản',
    ],
    next: 'Học xong chuyển lên Road to IELTS.',
    price: '1.200.000',
    oldPrice: '1.400.000',
    savings: '200K',
    brochure: 'https://canva.link/s6rchv6njq5zqzi',
  },
  {
    id: 'road-to-ielts',
    name: 'Road to IELTS',
    from: '5.0',
    // Brochure cam kết tối thiểu 6.0 sau 1-1,5 năm; nhiều bạn lên 7.0+ (Long chốt ghi 6.0-7.0+, 26/10/2026)
    to: '6.0-7.0+',
    tagline: 'Chiến lược làm bài và luyện đề như thi thật.',
    signs: [
      'Đọc hiểu bài mà làm đề vẫn sai.',
      'Viết Task 2 cứ lặp mãi vài từ quen.',
      'Nói Part 2 được một phút là hết ý.',
      'Cần 6.0+ để xét tuyển hoặc đi du học.',
    ],
    forWho:
      'Học sinh lớp 11 (hoặc lớp 10 muốn học sớm) đang quanh 5.0: ngữ pháp ổn nhưng thiếu từ học thuật, nói còn chậm, nghe đọc chưa ổn định. Mục tiêu là xét tuyển đại học hoặc du học.',
    facts: [
      { label: 'Thời gian', value: 'Khoảng 1,5 năm, 5 giai đoạn' },
      { label: 'Lịch học', value: '2 buổi/tuần' },
      { label: 'Giáo viên', value: 'Thầy Long (IELTS 8.5)' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    phases: [
      {
        title: 'IELTS Introduction',
        meta: '2 tháng',
        body: 'Làm quen đề thi và yêu cầu của 4 kỹ năng, củng cố từ vựng học thuật cơ bản.',
      },
      {
        title: 'IELTS Basis',
        meta: '2,5 tháng',
        body: 'Reading Passage 1, 2 và Listening Section 1, 2. Luyện mọi dạng Writing Task 2, dùng 5 khung trả lời Speaking Part 1.',
      },
      {
        title: 'Complete IELTS',
        meta: '2 tháng',
        body: 'Reading Passage 3 và Listening Section 3, 4 với các dạng khó hơn, tiếp tục Writing Task 2 và Speaking Part 1.',
      },
      {
        title: 'Complete IELTS 2',
        meta: '4 tháng',
        body: 'Làm Reading, Listening theo giờ thật, học Writing Task 1 và cách trả lời Speaking Part 2.',
      },
      {
        title: 'Advanced IELTS',
        meta: '3 tháng',
        body: 'Làm đề thật trong thời gian giới hạn, tập quản lý thời gian và tăng độ chính xác trước khi đi thi.',
      },
    ],
    outcomes: ['Tối thiểu 6.0 sau 1 đến 1,5 năm học đều', 'Sẵn sàng đăng ký thi thật'],
    price: '1.500.000',
    oldPrice: '1.750.000',
    savings: '250K',
    brochure: 'https://canva.link/iqi67oe336pt5h0',
  },
]
