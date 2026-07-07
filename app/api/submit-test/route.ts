import { NextRequest, NextResponse } from 'next/server'
import { saveTestResult, TestSubmission, findStudent } from '@/lib/google-sheets'
import { sendResultToLong, EmailExtras } from '@/lib/email'
import {
  suggestClassFromScores,
  getClassSpecialNotice,
  analyzeWriting,
  getLevelFeedback,
  estimateGradeFromDOB,
} from '@/lib/test-logic'

const isDev = process.env.NODE_ENV === 'development'
const isResendPlaceholder = !(process.env.RESEND_API_KEY) || (process.env.RESEND_API_KEY || '').includes('placeholder')

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

    // Save to Google Sheet (dev uses gws CLI internally)
    await saveTestResult(submission)

    // Send email to Long (skip only when Resend key is a placeholder)
    if (!isResendPlaceholder) {
      const extras: EmailExtras = {
        examDate,
        targetBand,
        studentLevel,
        studyTime,
        dob,
        workplace,
        learningFormat,
        ieltsStudied,
        gradeEstimate,
        specialNotice,
        writingFeedback: {
          task1: task1Analysis,
          task2: task2Analysis,
        },
      }
      await sendResultToLong(submission, extras)
    } else {
      console.log('[DEV] Email skipped — add a real RESEND_API_KEY to .env.local to enable')
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
