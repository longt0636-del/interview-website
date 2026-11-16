// Bản in A4 brochure IELTS Nền Tảng → PDF public/brochure/ielts-nen-tang-3-4.pdf. Khung chung: app/khoa-hoc/_brochure/BrochurePrint.tsx.
import { BrochurePrint, printMetadata } from '../../_brochure/BrochurePrint'
import { nenTang } from '@/lib/brochures/nen-tang'

export const metadata = printMetadata(nenTang)

export default function Page() {
  return <BrochurePrint b={nenTang} />
}
