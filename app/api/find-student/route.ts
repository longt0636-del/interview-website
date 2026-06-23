import { NextRequest, NextResponse } from 'next/server'
import { findStudent } from '@/lib/google-sheets'
import { determineTestLevel, suggestClass, StudentRecord } from '@/lib/test-logic'

const isDev = process.env.NODE_ENV === 'development'
const isPlaceholder = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').includes('placeholder')

function getMockStudent(name: string, phone: string): StudentRecord {
  const lowerName = name.toLowerCase()
  // Allow testing all 3 test levels via name keywords
  const level =
    lowerName.includes('test3') || lowerName.includes('test 3')
      ? 'Giỏi (sử dụng tốt trong công việc hoặc học tập)'
      : lowerName.includes('test2') || lowerName.includes('test 2')
      ? 'Trung bình (hiểu và nói được một số câu phức tạp)'
      : 'Cơ bản (biết từ vựng và ngữ pháp đơn giản)'

  return {
    name: name || 'Học viên test',
    phone: phone || '0900000000',
    level,
    ieltsStudied: 'Chưa',
    ieltsTested: 'Chưa',
    examDate: '',
    targetBand: '6.0',
    skills: 'Nghe, Nói',
    studyTime: '1–2 giờ',
    bestTime: 'Tối',
    rowIndex: 1,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json()

    if (!name && !phone) {
      return NextResponse.json(
        { error: 'Vui lòng nhập họ tên hoặc số điện thoại.' },
        { status: 400 }
      )
    }

    const student = await findStudent(name || '', phone || '')

    if (!student) {
      return NextResponse.json(
        {
          error:
            'Không tìm thấy thông tin. Vui lòng kiểm tra lại họ tên và số điện thoại, hoặc điền form khảo sát trước.',
        },
        { status: 404 }
      )
    }

    const testLevel = determineTestLevel(student)
    const suggestedClass = suggestClass(testLevel, student.level)

    return NextResponse.json({
      studentName: student.name,
      studentPhone: student.phone,
      testLevel,
      suggestedClass,
      level: student.level,
      _devMode: isDev && isPlaceholder,
    })
  } catch (err) {
    console.error('find-student error:', err)
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
