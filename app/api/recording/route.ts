import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path')
  if (!path || !path.startsWith('recordings/')) {
    return NextResponse.json({ error: 'Thiếu hoặc sai đường dẫn file.' }, { status: 400 })
  }

  try {
    const result = await get(path, { access: 'private' })
    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: 'Không tìm thấy file ghi âm.' }, { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'audio/mpeg',
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('recording proxy error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Lỗi khi tải file ghi âm.', detail }, { status: 500 })
  }
}
