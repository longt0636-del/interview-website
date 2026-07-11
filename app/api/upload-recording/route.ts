import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Không có file.' }, { status: 400 })
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Định dạng file không hợp lệ. Vui lòng upload file âm thanh (mp3, wav, m4a).' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File quá lớn. Tối đa 50MB.' }, { status: 400 })
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const blob = await put(`recordings/${timestamp}_${safeName}`, file, { access: 'private' })

    // Store hiện tại chỉ hỗ trợ private blob — trả về link proxy qua route riêng
    // (route đó dùng token phía server để đọc nội dung), thay vì trả thẳng blob.url.
    const proxyUrl = `${req.nextUrl.origin}/api/recording?path=${encodeURIComponent(blob.pathname)}`

    return NextResponse.json({ url: proxyUrl })
  } catch (err) {
    console.error('upload-recording error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Lỗi upload file.', detail }, { status: 500 })
  }
}
