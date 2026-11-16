// Brochure khoá IELTS Nền Tảng (thay Canva canva.link/d55b4f4fjkcghlc). Nội dung: lib/brochures/nen-tang.ts.
// Khung chung 3 khoá: app/khoa-hoc/_brochure/BrochurePage.tsx (Long 16/11/2026, theo thuyết noticing).
import { BrochurePage, brochureMetadata } from '../_brochure/BrochurePage'
import { nenTang } from '@/lib/brochures/nen-tang'

export const metadata = brochureMetadata(nenTang)

export default function Page() {
  return <BrochurePage b={nenTang} />
}
