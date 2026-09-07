import { Resend } from 'resend'
import { TestSubmission } from './google-sheets'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}
const LONG_EMAIL = 'longt0636@gmail.com'

export interface EmailExtras {
  examDate: string
  targetBand: string
  studentLevel: string
  studyTime: string
  dob?: string
  workplace?: string
  learningFormat?: string
  ieltsStudied?: string
  gradeEstimate?: string
  specialNotice?: string | null
  /** Các phần học viên chưa làm khi bấm nộp — rỗng nghĩa là nộp đầy đủ. */
  missingParts?: string[]
  writingFeedback?: {
    task2?: { wordCount: number; hasEnoughWords: boolean; vocabLevel: string; grammarNote: string }
    task1?: { wordCount: number; hasEnoughWords: boolean; vocabLevel: string; grammarNote: string }
  }
}

const CLASS_DESCRIPTIONS: Record<string, string> = {
  'IELTS Nền Tảng (Trình độ 3-4)': '6 tháng · 2 học kỳ · ~46 buổi · 1.200.000đ/tháng',
  'IELTS Căn Bản (Trình độ 4-5)': '10–12 tháng · 2 học kỳ · 1.200.000đ/tháng',
  'Complete IELTS (Trình độ 5-6+)': '~1.5 năm · 5 giai đoạn · 1.500.000đ/tháng',
}

// Mô tả ngắn dùng riêng cho tin nhắn Zalo: chỉ số buổi/tuần + học phí/tháng
const ZALO_CLASS_DESC: Record<string, string> = {
  'IELTS Nền Tảng (Trình độ 3-4)': '2 buổi/tuần – học phí: 1.200.000đ/tháng',
  'IELTS Căn Bản (Trình độ 4-5)': '2 buổi/tuần – học phí: 1.200.000đ/tháng',
  'Complete IELTS (Trình độ 5-6+)': '2 buổi/tuần – học phí: 1.500.000đ/tháng',
}

function buildZaloMessage(data: TestSubmission, extras: EmailExtras): string {
  const firstName = data.studentName.trim().split(' ').pop() || data.studentName
  const classDesc = ZALO_CLASS_DESC[data.suggestedClass] || CLASS_DESCRIPTIONS[data.suggestedClass] || ''
  const notice = extras.specialNotice
    ? `\n⚠️ *Lưu ý:* ${extras.specialNotice}`
    : ''

  return `Chào em.

Cảm ơn ${firstName} đã hoàn thành bài kiểm tra đầu vào của lớp thầy!

Dựa trên kết quả, thầy thấy ${firstName} phù hợp với lớp *${data.suggestedClass}* (${classDesc}).${notice}

Em có thể sắp xếp tham gia 2 buổi học thử miễn phí để trải nghiệm trực tiếp lớp học không?`
}

export async function sendResultToLong(data: TestSubmission, extras?: EmailExtras): Promise<void> {
  const testName =
    data.testLevel === 1 ? 'Test 1 — Grammar & Vocabulary (Mất gốc/Cơ bản)' :
    data.testLevel === 2 ? 'Test 2 — Reading, Listening & Writing (Trung bình)' :
                           'Test 3 — Full IELTS (Kinh nghiệm / Deadline gấp)'

  const scoreSection =
    data.testLevel === 1
      ? `Grammar: ${data.grammarScore || 'Chưa điền'} / Vocabulary: ${data.vocabScore || 'Chưa điền'}`
      : data.testLevel === 2
      ? `Reading: ${data.readingScore || 'Chưa điền'} | Listening S1: ${data.listeningS1 || 'Chưa điền'} | S2: ${data.listeningS2 || 'Chưa điền'}`
      : `Reading: ${data.readingScore || 'Chưa điền'} | Listening: ${data.listeningScore || 'Chưa điền'}`

  const writingSection =
    data.writingTask1 || data.writingTask2
      ? `\n--- WRITING ---\n${data.writingTask1 ? `Task 1:\n${data.writingTask1}\n\n` : ''}${data.writingTask2 ? `Task 2:\n${data.writingTask2}` : ''}`
      : ''

  const recordingUrls = data.recordingUrl ? data.recordingUrl.split('\n').filter(Boolean) : []
  const speakingSection = recordingUrls.length
    ? `\n--- SPEAKING ---\n${recordingUrls.length > 1
        ? recordingUrls.map((url, i) => `File ghi âm (lần ${i + 1}/${recordingUrls.length}): ${url}`).join('\n')
        : `File ghi âm: ${recordingUrls[0]}`}`
    : ''

  const gradeAndSchool = extras
    ? [extras.gradeEstimate, extras.workplace].filter(Boolean).join(' — ')
    : ''

  const studentProfile = extras
    ? `Ngày tháng năm sinh: ${extras.dob || 'Chưa điền'}
Học sinh lớp mấy, trường nào: ${gradeAndSchool || 'Chưa điền'}
Trình độ tự báo cáo: ${extras.studentLevel}
Đã từng học IELTS chưa: ${extras.ieltsStudied || 'Chưa điền'}
Thời gian dự kiến thi: ${extras.examDate || 'Chưa xác định'}
Band mục tiêu: ${extras.targetBand || 'Chưa điền'}
Bạn thích học hình thức nào: ${extras.learningFormat || 'Chưa điền'}`
    : ''

  const specialNoticeSection = extras?.specialNotice
    ? `\n⚠️ LƯU Ý ĐẶC BIỆT:\n${extras.specialNotice}`
    : ''

  const writingFeedbackSection = extras?.writingFeedback
    ? [
        extras.writingFeedback.task1
          ? `Writing Task 1: ${extras.writingFeedback.task1.wordCount} từ ${extras.writingFeedback.task1.hasEnoughWords ? '✓' : '(thiếu)'} · ${extras.writingFeedback.task1.vocabLevel} · ${extras.writingFeedback.task1.grammarNote}`
          : '',
        extras.writingFeedback.task2
          ? `Writing Task 2: ${extras.writingFeedback.task2.wordCount} từ ${extras.writingFeedback.task2.hasEnoughWords ? '✓' : '(thiếu)'} · ${extras.writingFeedback.task2.vocabLevel} · ${extras.writingFeedback.task2.grammarNote}`
          : '',
      ].filter(Boolean).join('\n')
    : ''

  // Học viên giờ được phép nộp bài dở (trước đây nút Nộp bị khoá tới khi đủ hết),
  // nên email phải nói rõ đây là bài thiếu để thầy không tưởng là làm kém.
  const isPartial = !!extras?.missingParts?.length
  const partialSection = isPartial
    ? `\n⚠️ BÀI NỘP CHƯA ĐẦY ĐỦ — học viên chủ động nộp phần đã làm.\nChưa làm: ${extras!.missingParts!.join(', ')}\n`
    : ''

  const zaloMsg = extras ? `\n\n${'─'.repeat(50)}\n📱 GỢI Ý TIN NHẮN ZALO (paste ngay):\n${'─'.repeat(50)}\n\n${buildZaloMessage(data, extras)}\n${'─'.repeat(50)}` : ''
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'LongIELTS <onboarding@resend.dev>'

  const body = `
Học viên mới nộp bài — cần xem xét và liên hệ.
${partialSection}
=== THÔNG TIN HỌC VIÊN ===
Họ tên: ${data.studentName}
SĐT: ${data.studentPhone}
${studentProfile}

=== BÀI TEST ===
Loại: ${testName}
${scoreSection}
${writingFeedbackSection ? `\n--- PHÂN TÍCH WRITING ---\n${writingFeedbackSection}` : ''}
${writingSection}
${speakingSection}

=== GỢI Ý XẾP LỚP ===
${data.suggestedClass}
${CLASS_DESCRIPTIONS[data.suggestedClass] || ''}
${specialNoticeSection}
${zaloMsg}

---
Xem chi tiết: https://docs.google.com/spreadsheets/d/1f-AI4H-UMKDKSObyoEfZk_WlAvKuJZZDdoEgJ01T7SQ
`.trim()

  const subject = `[Học viên mới]${isPartial ? '[BÀI THIẾU]' : ''} ${data.studentName} — ${testName}`

  const { error } = await getResend().emails.send({
    from: fromAddress,
    to: LONG_EMAIL,
    subject,
    text: body,
  })
  if (error) {
    throw new Error(`Resend failed to send lead notification: ${JSON.stringify(error)}`)
  }
}

export async function sendConfirmationToStudent(
  studentEmail: string | undefined,
  studentName: string
): Promise<void> {
  if (!studentEmail) return
  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'LongIELTS <onboarding@resend.dev>',
    to: studentEmail,
    subject: 'Thầy Long đã nhận được bài test của bạn!',
    text: `Chào ${studentName},\n\nThầy Long đã nhận được bài kiểm tra trình độ của bạn.\nTrong vòng 24 giờ, thầy sẽ liên hệ qua số điện thoại để sắp xếp buổi học thử.\n\nHẹn gặp bạn sớm!\nThầy Long — LongIELTS`,
  })
  if (error) {
    throw new Error(`Resend failed to send student confirmation: ${JSON.stringify(error)}`)
  }
}
