import { NextRequest, NextResponse } from 'next/server'
import { scheduleCallback } from '@/lib/google-sheets'

export async function POST(req: NextRequest) {
  try {
    const { studentName, callbackDate, status, insertIfMissing } = await req.json()
    if (!studentName || !callbackDate) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
    }
    await scheduleCallback(studentName, callbackDate, status, insertIfMissing)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('schedule-callback error:', err)
    return NextResponse.json({ error: 'Lỗi khi cập nhật lịch' }, { status: 500 })
  }
}
