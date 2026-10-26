// Ba khoá đang tuyển, xếp thành con đường từ mất gốc tới 6.0-7.0+ (thay cho 3 thẻ khoá học bấm ra brochure Canva).
// Nội dung lấy từ 3 brochure Canva: Foundation 3-4 (DAHK0SMiSBA), IELTS Cơ Bản (DAG2BsuxsLU), Road to IELTS (DAG2BtdxhVM).
// Học phí giữ đúng con số web đang hiện trước đó, riêng giá gốc Road to IELTS theo brochure: 1.750.000đ (Long chốt 26/10/2026).
// 26/10/2026 (bản 2): "Học gì" viết chung chung, không kể từng kỳ/giai đoạn (Long: "less specific about what they gonna learn").

export type Course = {
  id: string
  name: string
  /** Tên ngắn trên nút của chặng */
  short: string
  /** Band ở đầu và cuối chặng */
  from: string
  to: string
  tagline: string
  /** Những câu học sinh ở chặng này hay nghĩ trong đầu */
  signs: string[]
  forWho: string
  learn: string[]
  outcomes: string[]
  facts: { label: string; value: string }[]
  price: string
  oldPrice: string
  savings: string
  /** Link brochure mở tab mới */
  brochure: string
  /** Bản nhúng của cùng brochure, xem ngay trong trang */
  brochureEmbed: string
}

export const courses: Course[] = [
  {
    id: 'nen-tang',
    name: 'IELTS Nền Tảng',
    short: 'Nền Tảng',
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
    learn: [
      'Từ vựng theo chủ đề quen thuộc và ngữ pháp căn bản',
      'Phát âm chuẩn để tự tin nói những câu đầu tiên',
      'Làm quen đủ 4 kỹ năng trước khi vào IELTS',
    ],
    outcomes: ['Nói được 1 đến 2 phút về chủ đề quen thuộc', 'Viết được đoạn ngắn đúng cấu trúc', 'Đủ nền để lên IELTS Căn Bản'],
    facts: [
      { label: 'Thời gian', value: '6 tháng, 2 kỳ' },
      { label: 'Lịch học', value: '2 buổi/tuần, 90 phút/buổi' },
      { label: 'Giáo viên', value: 'Cô Hồ Xuân Tiên và thầy Long' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    price: '1.200.000',
    oldPrice: '1.400.000',
    savings: '200K',
    brochure: 'https://canva.link/d55b4f4fjkcghlc',
    brochureEmbed: 'https://www.canva.com/design/DAHK0SMiSBA/aw7SoPlMBOTTXIOLPik1aQ/view?embed',
  },
  {
    id: 'can-ban',
    name: 'IELTS Căn Bản',
    short: 'Căn Bản',
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
    learn: [
      'Ôn chắc ngữ pháp và dùng được khi nói, viết',
      'Luyện nghe đều đặn mỗi tuần',
      'Làm quen các dạng bài IELTS cơ bản',
    ],
    outcomes: ['Nói và viết được câu hoàn chỉnh', 'Quen dạng bài IELTS ở mức căn bản', 'Sẵn sàng lên Road to IELTS'],
    facts: [
      { label: 'Thời gian', value: '10 đến 12 tháng, 2 kỳ' },
      { label: 'Lịch học', value: '2 buổi/tuần' },
      { label: 'Giáo viên', value: 'Thầy Long' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    price: '1.200.000',
    oldPrice: '1.400.000',
    savings: '200K',
    brochure: 'https://canva.link/s6rchv6njq5zqzi',
    brochureEmbed: 'https://www.canva.com/design/DAG2BsuxsLU/CskomUiv8uSpYUgukJYO6g/view?embed',
  },
  {
    id: 'road-to-ielts',
    name: 'Road to IELTS',
    short: 'Road to IELTS',
    from: '5.0',
    // Brochure cam kết tối thiểu 6.0 sau 1-1,5 năm (Long chốt ghi 6.0-7.0+, 26/10/2026)
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
    learn: [
      'Cách làm từng dạng bài Reading, Listening',
      'Writing Task 1, Task 2 và Speaking theo khung rõ ràng',
      'Luyện đề thật theo giờ trước khi đi thi',
    ],
    outcomes: ['Tối thiểu 6.0 sau 1 đến 1,5 năm học đều', 'Sẵn sàng đăng ký thi thật'],
    facts: [
      { label: 'Thời gian', value: 'Khoảng 1,5 năm' },
      { label: 'Lịch học', value: '2 buổi/tuần' },
      { label: 'Giáo viên', value: 'Thầy Long (IELTS 8.5)' },
      { label: 'Sĩ số', value: 'Tối đa 10 bạn' },
    ],
    price: '1.500.000',
    oldPrice: '1.750.000',
    savings: '250K',
    brochure: 'https://canva.link/iqi67oe336pt5h0',
    brochureEmbed: 'https://www.canva.com/design/DAG2BtdxhVM/0Oeyx5j1guSY4_taxPx5Jw/view?embed',
  },
]
