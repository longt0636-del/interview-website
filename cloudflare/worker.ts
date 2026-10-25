// Cửa vào của web tuyển sinh (bài test đầu vào) trên Cloudflare Workers (25/10/2026). Bọc worker OpenNext để tự xử lý
// file ghi âm Speaking của học viên — kho R2 RIÊNG TƯ `longielts-recordings` (binding RECORDINGS), không ai mở thẳng được:
//
//   PUT /api/upload-recording?path=recordings/<tên>   học viên gửi file (tối đa 50 MB) — ghi thẳng luồng vào R2, không
//                                                     giữ cả file trong bộ nhớ (thay cho cách tải thẳng lên Vercel Blob)
//   GET /api/recording?path=recordings/<tên>          thầy nghe lại (link nằm trong thư báo + sổ) — có tua (Range)
//
// Bản Vercel vẫn dùng app/api/upload-recording + app/api/recording như cũ.

// @ts-expect-error — file do `opennextjs-cloudflare build` sinh ra
import { default as nextHandler } from '../.open-next/worker.js'

// @ts-expect-error — file do `opennextjs-cloudflare build` sinh ra
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from '../.open-next/worker.js'

interface R2Obj {
  size: number
  httpEtag: string
  range?: { offset?: number; length?: number; suffix?: number }
  body?: ReadableStream
  writeHttpMetadata(h: Headers): void
}
interface Env {
  RECORDINGS: {
    get(key: string, opts?: { range?: Headers; onlyIf?: Headers }): Promise<R2Obj | null>
    put(key: string, value: ReadableStream | ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>
  }
}

// Giống app/api/upload-recording/route.ts — máy ghi âm Android/iPhone/Zalo cho ra đủ loại đuôi.
const ALLOWED = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.aac', '.amr', '.3gp', '.3gpp', '.opus', '.flac', '.wma', '.mp4', '.caf']
const MAX_BYTES = 50 * 1024 * 1024

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })

function validKey(path: string | null): string | null {
  if (!path || !path.startsWith('recordings/') || path.includes('..') || path.length > 300) return null
  return path
}

async function upload(request: Request, env: Env, url: URL): Promise<Response> {
  const key = validKey(url.searchParams.get('path'))
  if (!key) return json({ error: 'Thiếu hoặc sai đường dẫn file.' }, 400)
  const ext = key.slice(key.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED.includes(ext)) return json({ error: 'Định dạng file không hợp lệ. Vui lòng upload file âm thanh (mp3, wav, m4a).' }, 400)
  const len = Number(request.headers.get('content-length'))
  if (!len || !request.body) return json({ error: 'File trống.' }, 400)
  if (len > MAX_BYTES) return json({ error: 'File vượt dung lượng cho phép (quá 50MB).' }, 413)
  await env.RECORDINGS.put(key, request.body, {
    httpMetadata: { contentType: request.headers.get('content-type') || 'application/octet-stream' },
  })
  return json({ pathname: key })
}

async function download(request: Request, env: Env, url: URL): Promise<Response> {
  const key = validKey(url.searchParams.get('path'))
  if (!key) return json({ error: 'Thiếu hoặc sai đường dẫn file.' }, 400)
  const wantsRange = request.headers.has('range')
  const obj = await env.RECORDINGS.get(key, { range: wantsRange ? request.headers : undefined, onlyIf: request.headers })
  if (!obj) return json({ error: 'Không tìm thấy file ghi âm.' }, 404)
  const h = new Headers()
  obj.writeHttpMetadata(h)
  h.set('etag', obj.httpEtag)
  h.set('accept-ranges', 'bytes')
  h.set('cache-control', 'private, max-age=31536000, immutable')
  if (!h.has('content-type')) h.set('content-type', 'audio/mpeg')
  if (!obj.body) return new Response(null, { status: 304, headers: h })
  if (wantsRange && obj.range) {
    const r = obj.range
    const offset = r.suffix !== undefined ? Math.max(0, obj.size - r.suffix) : (r.offset ?? 0)
    const length = r.suffix !== undefined ? Math.min(r.suffix, obj.size) : (r.length ?? obj.size - offset)
    h.set('content-range', `bytes ${offset}-${offset + length - 1}/${obj.size}`)
    h.set('content-length', String(length))
    return new Response(request.method === 'HEAD' ? null : obj.body, { status: 206, headers: h })
  }
  h.set('content-length', String(obj.size))
  return new Response(request.method === 'HEAD' ? null : obj.body, { status: 200, headers: h })
}

export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/upload-recording' && request.method === 'PUT') return await upload(request, env, url)
      if (url.pathname === '/api/recording' && (request.method === 'GET' || request.method === 'HEAD')) return await download(request, env, url)
    } catch (e) {
      console.error('[recordings]', e instanceof Error ? e.message : e)
      return json({ error: 'Lỗi khi xử lý file ghi âm. Bạn thử lại sau ít phút nhé.' }, 500)
    }
    return nextHandler.fetch(request, env, ctx)
  },
}
