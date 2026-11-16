// Font thương hiệu LongIELTS (kiểu Vox): Be Vietnam Pro cho tiêu đề + chữ thường, Lora cho tiêu đề chương, trích dẫn, ghi chú.
// Chỉ dùng cho brochure /khoa-hoc/* (trang chủ web tuyển sinh vẫn dùng Inter + Playfair của layout gốc).
import { Be_Vietnam_Pro, Lora } from 'next/font/google'

export const bvp = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-bvp',
  display: 'swap',
})

export const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})
