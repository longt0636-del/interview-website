import { NextRequest, NextResponse } from 'next/server'
import { saveTestResult, TestSubmission, findStudent } from '@/lib/google-sheets'
import { sendResultToLong, EmailExtras } from '@/lib/email'
import { oauthUserFromEnv } from '@/lib/google-lite'
import {
  suggestClassFromScores,
  getClassSpecialNotice,
  analyzeWriting,
  getLevelFeedback,
  estimateGradeFromDOB,
} from '@/lib/test-logic'

// 26/10/2026: trên Cloudflare không có khoá Resend — email gửi bằng Gmail của thầy (xem sendMail trong lib/email.ts).
// Trước đây chỉ kiểm khoá Resend nên từ lúc chuyển sang Cloudflare email kết quả bị bỏ qua.
function canSendMail(): boolean {
  const resend = process.env.RESEND_API_KEY || ''
  return (!!resend && !resend.includes('placeholder')) || !!oauthUserFromEnv()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Look up student to get exam date, target band, level (needed for class logic + email)
    const studentRecord = await findStudent(body.studentName || '', body.studentPhone || '')
    const examDate    = studentRecord?.examDate   || ''
    const targetBand  = studentRecord?.targetBand  || ''
    const studentLevel = studentRecord?.level      || ''
    const studyTime   = studentRecord?.studyTime   || ''
    const dob         = studentRecord?.dob         || ''
    const workplace   = studentRecord?.workplace   || ''
    const learningFormat = studentRecord?.learningFormat || ''
    const schedule    = studentRecord?.schedule    || ''
    const ieltsStudied = studentRecord?.ieltsStudied || ''
    const gradeEstimate = estimateGradeFromDOB(dob)

    // Calculate suggested class from actual test scores + exam date
    const suggestedClass = suggestClassFromScores(
      {
        testLevel:      body.testLevel,
        grammarScore:   body.grammarScore,
        vocabScore:     body.vocabScore,
        readingScore:   body.readingScore,
        listeningS1:    body.listeningS1,
        listeningS2:    body.listeningS2,
        listeningScore: body.listeningScore,
      },
      examDate
    )

    // Special notice: weak Test-2 student placed in higher class due to deadline
    const specialNotice = getClassSpecialNotice(body.testLevel, body.readingScore, examDate)

    // Writing analysis (general — word count, vocab, grammar)
    const task2Analysis = body.writingTask2
      ? analyzeWriting(body.writingTask2, 250)
      : undefined
    const task1Analysis = body.writingTask1
      ? analyzeWriting(body.writingTask1, 150)
      : undefined

    // General level feedback for the student result page
    const levelFeedback = getLevelFeedback(body.testLevel, {
      grammarScore:   body.grammarScore,
      vocabScore:     body.vocabScore,
      readingScore:   body.readingScore,
      listeningScore: body.listeningScore,
    })

    const submission: TestSubmission = {
      studentName:    body.studentName   || '',
      studentPhone:   body.studentPhone  || '',
      testLevel:      body.testLevel,
      grammarScore:   body.grammarScore,
      vocabScore:     body.vocabScore,
      readingScore:   body.readingScore,
      listeningS1:    body.listeningS1,
      listeningS2:    body.listeningS2,
      listeningScore: body.listeningScore,
      writingTask1:   body.writingTask1,
      writingTask2:   body.writingTask2,
      recordingUrl:   body.recordingUrl,
      suggestedClass,
      submittedAt:    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    }

    // Save to Google Sheet
    await saveTestResult(submission)

    // Send email to Long (skip only when Resend key is a placeholder)
    if (canSendMail()) {
      const extras: EmailExtras = {
        examDate,
        targetBand,
        studentLevel,
        studyTime,
        dob,
        workplace,
        learningFormat,
        ieltsStudied,
        schedule,
        gradeEstimate,
        specialNotice,
        missingParts: Array.isArray(body.missingParts) ? body.missingParts : [],
        writingFeedback: {
          task1: task1Analysis,
          task2: task2Analysis,
        },
      }
      // Bài đã lưu vào sổ rồi — email lỗi thì chỉ ghi log, không báo lỗi cho học sinh.
      try {
        await sendResultToLong(submission, extras)
      } catch (mailErr) {
        console.error('submit-test: gửi email kết quả cho thầy thất bại:', mailErr)
      }
    } else {
      console.log('[DEV] Email skipped — chưa có RESEND_API_KEY hay khoá Google (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN)')
    }

    return NextResponse.json({
      success: true,
      suggestedClass,
      specialNotice: specialNotice || null,
      levelFeedback,
      writingFeedback: {
        task1: task1Analysis || null,
        task2: task2Analysis || null,
      },
    })
  } catch (err) {
    console.error('submit-test error:', err)
    return NextResponse.json({ error: 'Lỗi khi lưu kết quả. Vui lòng thử lại.' }, { status: 500 })
  }
}
