// Bản in A4 brochure IELTS Căn Bản → PDF public/brochure/ielts-can-ban-4-5.pdf. Khung chung: app/khoa-hoc/_brochure/BrochurePrint.tsx.
import { BrochurePrint, printMetadata } from '../../_brochure/BrochurePrint'
import { canBan } from '@/lib/brochures/can-ban'

export const metadata = printMetadata(canBan)

export default function Page() {
  return <BrochurePrint b={canBan} />
}
