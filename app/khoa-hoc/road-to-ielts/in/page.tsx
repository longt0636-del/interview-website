// Bản in A4 brochure Road to IELTS 5.0-6.0+ → PDF public/brochure/ielts-road-to-ielts-5-6.pdf. Khung chung: app/khoa-hoc/_brochure/BrochurePrint.tsx.
import { BrochurePrint, printMetadata } from '../../_brochure/BrochurePrint'
import { roadToIelts } from '@/lib/brochures/road-to-ielts'

export const metadata = printMetadata(roadToIelts)

export default function Page() {
  return <BrochurePrint b={roadToIelts} />
}
