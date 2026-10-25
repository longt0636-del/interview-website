// Cấu hình OpenNext cho Cloudflare (25/10/2026). Web này không dùng revalidateTag nên chỉ cần kho cache R2.
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
