// Brochure khoá Road to IELTS 5.0-6.0+ (thay Canva canva.link/iqi67oe336pt5h0). Nội dung: lib/brochures/road-to-ielts.ts.
// Khung chung 3 khoá: app/khoa-hoc/_brochure/BrochurePage.tsx (Long 16/11/2026, theo thuyết noticing).
import { BrochurePage, brochureMetadata } from '../_brochure/BrochurePage'
import { roadToIelts } from '@/lib/brochures/road-to-ielts'

export const metadata = brochureMetadata(roadToIelts)

export default function Page() {
  return <BrochurePage b={roadToIelts} />
}
