import { XepLopTestPage } from '@/components/xep-lop/XepLopTestPage'
import { TEST_561 } from '@/lib/xep-lop/content-561'

// Bài kiểm tra xếp lớp (17/11/2026) — nội dung sinh từ AIOS teaching/general/test-xep-lop/xuat_web.py
export default function Page() {
  return <XepLopTestPage test={TEST_561} />
}
