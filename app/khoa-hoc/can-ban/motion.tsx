'use client'

// Chuyển động của brochure (không dùng thư viện): chữ hiện dần, ảnh trôi nhẹ trong khung, các lớp trang bìa trôi
// khác tốc độ, số chương ở lề trái đổi theo chương đang đọc, và phiếu điểm tự đóng dấu (điểm nhấn của trang).
// Mặc định (chưa chạy JS / bản in) mọi thứ hiện đầy đủ; chỉ khi JS chạy và máy KHÔNG bật giảm chuyển động
// mới thêm lớp .motion-ready để ẩn trước rồi hiện theo cuộn.
import { useEffect } from 'react'

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function BrochureMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.bro')
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // giữ trạng thái đầy đủ, không ẩn gì, không trôi gì
    root.classList.add('motion-ready')

    // 1. Hiện dần khi vào màn hình (một lần)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
    root.querySelectorAll('[data-in],[data-reveal]').forEach((el) => io.observe(el))

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'))
    const drifts = Array.from(root.querySelectorAll<HTMLElement>('[data-drift]'))
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    const folio = root.querySelector<HTMLElement>('[data-folio]')
    const folioNum = root.querySelector<HTMLElement>('[data-folio-num]')
    const folioTitle = root.querySelector<HTMLElement>('[data-folio-title]')
    const stage = root.querySelector<HTMLElement>('[data-stamp-stage]')
    const stamps = stage ? Array.from(stage.querySelectorAll<HTMLElement>('[data-stamp-at]')) : []
    const ring = stage?.querySelector<SVGPathElement>('[data-ring]') ?? null

    let raf = 0
    let lastChapter = ''

    const tick = () => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY

      // 2. Trang bìa: lớp sau trôi chậm hơn, tờ phiếu điểm phía trước trôi nhanh hơn (chỉ khi bìa còn trên màn hình)
      if (y < vh * 1.2) {
        for (const l of layers) {
          const d = parseFloat(l.dataset.depth || '0')
          l.style.transform = `translate3d(0, ${(-y * d).toFixed(1)}px, 0)`
        }
      }

      // 3. Ảnh trôi nhẹ trong khung của nó
      for (const el of drifts) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -100 || r.top > vh + 100) continue
        const c = (r.top + r.height / 2 - vh / 2) / vh
        el.style.setProperty('--drift', (c * parseFloat(el.dataset.drift || '0')).toFixed(2) + 'px')
      }

      // 4. Số chương ở lề
      let cur: HTMLElement | null = null
      for (const c of chapters) if (c.getBoundingClientRect().top <= vh * 0.45) cur = c
      if (folio) {
        const key = cur ? cur.dataset.num || '' : ''
        if (key !== lastChapter) {
          lastChapter = key
          if (cur && folioNum && folioTitle) {
            folioNum.textContent = cur.dataset.num || ''
            folioTitle.textContent = cur.dataset.chapter || ''
            folio.classList.add('is-on')
          } else folio.classList.remove('is-on')
        }
      }

      // 5. Phiếu điểm tự đóng dấu
      if (stage) {
        const r = stage.getBoundingClientRect()
        const span = Math.max(1, r.height - vh * 0.75)
        const p = clamp((vh * 0.2 - r.top) / span)
        for (const s of stamps) s.classList.toggle('is-stamped', p >= parseFloat(s.dataset.stampAt || '0'))
        if (ring) {
          const q = clamp((p - 0.6) / 0.24)
          ring.style.strokeDashoffset = (1 - q).toFixed(3)
        }
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])
  return null
}
