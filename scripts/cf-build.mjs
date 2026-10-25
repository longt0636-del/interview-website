// Build web tuyển sinh cho Cloudflare Workers (25/10/2026). Bản build Vercel không chạy file này.
//  · NEXT_PUBLIC_RECORDING_STORE=r2 → trang test 3 gửi file ghi âm thẳng lên máy chủ (cloudflare/worker.ts) thay vì Vercel Blob.
//  · Video học viên (public/videos, có file 28,6 MB) vượt trần 25 MB/file tĩnh của Cloudflare → tạm cất ra ngoài lúc build,
//    trang phát từ kho R2 qua NEXT_PUBLIC_MEDIA_BASE (file đã chép lên R2 ở website/videos/).
import { renameSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const env = {
  ...process.env,
  // Hộp "Web đang được nâng cấp" (components/MaintenanceNotice.tsx) chỉ dành cho bản Vercel — bản Cloudflare tự ẩn.
  NEXT_PUBLIC_PLATFORM: 'cloudflare',
  // Mã commit đang dựng (Workers Builds tự có WORKERS_CI_COMMIT_SHA; dựng bằng Docker thì scripts/cf-docker-build.sh truyền GIT_SHA).
  NEXT_PUBLIC_GIT_SHA: process.env.WORKERS_CI_COMMIT_SHA || process.env.GIT_SHA || '',
  NEXT_PUBLIC_RECORDING_STORE: 'r2',
  NEXT_PUBLIC_MEDIA_BASE: process.env.NEXT_PUBLIC_MEDIA_BASE ?? 'https://portal.longielts.workers.dev/f/website',
}
const moved = existsSync('public/videos')
if (moved) renameSync('public/videos', '.videos-ngoai-build')
let status = 1
try {
  status = spawnSync('npx', ['opennextjs-cloudflare', 'build'], { stdio: 'inherit', env, shell: true }).status ?? 1
} finally {
  if (moved) renameSync('.videos-ngoai-build', 'public/videos')
}
process.exit(status)
