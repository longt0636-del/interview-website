import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

// Chỉ kiểm tra đuôi file — content-type gửi lên do client tự suy từ đuôi file
// (xem AUDIO_MIME_BY_EXT ở app/test/3/page.tsx), không dùng MIME trình duyệt tự đoán
// vì Safari/iOS thường gán sai hoặc để trống cho .m4a.
//
// 17/09/2026: danh sách này TỪNG là lý do học viên không nộp được. Máy ghi âm mặc định của nhiều
// điện thoại Android (và tin nhắn thoại Zalo) cho ra `.amr` / `.3gp` / `.opus`; iPhone đôi khi cho
// `.mp4` hoặc `.caf`. Các đuôi đó bị từ chối, và thứ hiện ra trên màn hình em là một câu tiếng Anh
// của thư viện upload ("Vercel Blob: Failed to retrieve the client token") — không ai hiểu là do
// định dạng file. Thầy chỉ cần NGHE được file, nên nhận rộng ra; định dạng lạ thì thầy tự mở bằng
// máy, còn hơn là em không nộp được bài.
const allowedExtensions = [
  '.mp3',
  '.wav',
  '.m4a',
  '.ogg',
  '.webm',
  '.aac',
  '.amr',
  '.3gp',
  '.3gpp',
  '.opus',
  '.flac',
  '.wma',
  '.mp4',
  '.caf',
]

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
          // `video/*` có ở đây KHÔNG phải để nhận video: `.3gp` và `.mp4` do máy ghi âm Android/iPhone
          // sinh ra mang content-type `video/3gpp` / `video/mp4` dù bên trong chỉ có tiếng nói.
          // Chặn theo ĐUÔI FILE ở trên mới là hàng rào thật.
          allowedContentTypes: ['audio/*', 'video/*', 'application/octet-stream'],
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
