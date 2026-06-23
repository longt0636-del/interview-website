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
  specialNotice?: string | null
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

function buildZaloMessage(data: TestSubmission, extras: EmailExtras): string {
  const firstName = data.studentName.trim().split(' ').pop() || data.studentName
  const classDesc = CLASS_DESCRIPTIONS[data.suggestedClass] || ''
  const notice = extras.specialNotice
    ? `\n⚠️ *Lưu ý:* ${extras.specialNotice}`
    : ''

  return `Chào ${firstName}! Thầy Long đây ạ 😊

Cảm ơn ${firstName} đã hoàn thành bài kiểm tra đầu vào LongIELTS!

Dựa trên kết quả, thầy thấy ${firstName} phù hợp với lớp *${data.suggestedClass}* (${classDesc}).${notice}

Thầy muốn mời ${firstName} tham gia *2 buổi học thử miễn phí* để trải nghiệm trực tiếp cách học của lớp.

${firstName} có thể sắp xếp đến vào *[NGÀY/GIỜ]* không ạ? Nếu không tiện thì mình có thể đổi buổi khác 😊`
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

  const speakingSection = data.recordingUrl
    ? `\n--- SPEAKING ---\nFile ghi âm: ${data.recordingUrl}`
    : ''

  const studentProfile = extras
    ? `Trình độ tự báo cáo: ${extras.studentLevel}
Thời gian dự kiến thi: ${extras.examDate || 'Chưa xác định'}
Band mục tiêu: ${extras.targetBand || 'Chưa điền'}
Thời gian tự học: ${extras.studyTime || 'Chưa điền'}`
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

  const zaloMsg = extras ? `\n\n${'─'.repeat(50)}\n📱 GỢI Ý TIN NHẮN ZALO (paste ngay):\n${'─'.repeat(50)}\n\n${buildZaloMessage(data, extras)}\n${'─'.repeat(50)}` : ''

  const body = `
Học viên mới nộp bài — cần xem xét và liên hệ.

=== THÔNG TIN HỌC VIÊN ===
Họ tên: ${data.studentName}
SĐT: ${data.studentPhone}
Thời gian nộp: ${data.submittedAt}
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

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'LongIELTS <onboarding@resend.dev>'

  await getResend().emails.send({
    from: fromAddress,
    to: LONG_EMAIL,
    subject: `[Học viên mới] ${data.studentName} — ${testName}`,
    text: body,
  })
}

export async function sendConfirmationToStudent(
  studentEmail: string | undefined,
  studentName: string
): Promise<void> {
  if (!studentEmail) return
  await getResend().emails.send({
    from: 'LongIELTS <noreply@longielts.com>',
    to: studentEmail,
    subject: 'Thầy Long đã nhận được bài test của bạn!',
    text: `Chào ${studentName},\n\nThầy Long đã nhận được bài kiểm tra trình độ của bạn.\nTrong vòng 24 giờ, thầy sẽ liên hệ qua số điện thoại để sắp xếp buổi học thử.\n\nHẹn gặp bạn sớm!\nThầy Long — LongIELTS`,
  })
}
