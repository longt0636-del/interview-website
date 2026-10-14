import { NextRequest, NextResponse } from 'next/server'
import { findStudent } from '@/lib/google-sheets'
import { determineTestLevel, suggestClass } from '@/lib/test-logic'

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
    })
  } catch (err) {
    console.error('find-student error:', err)
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
