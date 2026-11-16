// Brochure khoá IELTS Căn Bản 4.0-5.0 (thay Canva canva.link/s6rchv6njq5zqzi). Nội dung: lib/brochures/can-ban.ts.
// Khung chung 3 khoá: app/khoa-hoc/_brochure/BrochurePage.tsx (Long 16/11/2026, theo thuyết noticing).
import { BrochurePage, brochureMetadata } from '../_brochure/BrochurePage'
import { canBan } from '@/lib/brochures/can-ban'

export const metadata = brochureMetadata(canBan)

export default function Page() {
  return <BrochurePage b={canBan} />
}
