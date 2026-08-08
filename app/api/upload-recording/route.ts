import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

// Chỉ kiểm tra đuôi file — content-type gửi lên do client tự suy từ đuôi file
// (xem AUDIO_MIME_BY_EXT ở app/test/3/page.tsx), không dùng MIME trình duyệt tự đoán
// vì Safari/iOS thường gán sai hoặc để trống cho .m4a.
const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac']

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const ext = pathname.slice(pathname.lastIndexOf('.')).toLowerCase()
        if (!allowedExtensions.includes(ext)) {
          throw new Error('Định dạng file không hợp lệ. Vui lòng upload file âm thanh (mp3, wav, m4a).')
        }
        return {
          allowedContentTypes: ['audio/*', 'video/webm', 'application/octet-stream'],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: false,
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (err) {
    console.error('upload-recording token error:', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Lỗi upload file.', detail }, { status: 400 })
  }
}
