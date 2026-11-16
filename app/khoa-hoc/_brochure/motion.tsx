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
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('video[data-autoplay]'))

    // 0. Chương "Trang học riêng": bấm một tính năng → video tua tới đúng cảnh; video chạy tới cảnh nào thì tính năng đó sáng lên.
    //    Cảnh của video trang học (24 giây): sửa bài viết 0-3s (lặp lại từ 20.3s), bài nói thành chữ 6.3-10.2s,
    //    nộp xong biết câu sai 10.3-14.2s, ôn từ vựng 14.3-18s. Chạy cả khi máy bật giảm chuyển động (người dùng tự bấm).
    const web = root.querySelector<HTMLElement>('[data-web]')
    const webVideo = web?.querySelector<HTMLVideoElement>('video') ?? null
    const webItems = web ? Array.from(web.querySelectorAll<HTMLButtonElement>('[data-scene]')) : []
    const RANGES: [number, number][] = [
      [0, 3.2],
      [6.3, 10.2],
      [10.3, 14.2],
      [14.3, 18],
    ]
    const onWebTime = () => {
      if (!webVideo) return
      const t = webVideo.currentTime
      for (const it of webItems) {
        const s = parseFloat(it.dataset.scene || '0')
        const r = RANGES.find(([a]) => Math.abs(a - s) < 0.5) ?? [s, s + 3.5]
        const on = (t >= r[0] && t < r[1]) || (s < 1 && t >= 20.3)
        it.classList.toggle('is-active', on)
        it.setAttribute('aria-pressed', on ? 'true' : 'false')
      }
    }
    const onWebClick = (e: Event) => {
      const it = (e.currentTarget as HTMLElement) || null
      if (!webVideo || !it) return
      webVideo.preload = 'auto'
      webVideo.currentTime = parseFloat(it.dataset.scene || '0')
      webVideo.play().catch(() => (webVideo.controls = true))
      onWebTime()
    }
    webItems.forEach((it) => it.addEventListener('click', onWebClick))
    webVideo?.addEventListener('timeupdate', onWebTime)

    if (reduce) {
      // giữ trạng thái đầy đủ, không ẩn gì, không trôi gì; video không tự chạy, có nút bấm
      videos.forEach((v) => (v.controls = true))
      return () => {
        webItems.forEach((it) => it.removeEventListener('click', onWebClick))
        webVideo?.removeEventListener('timeupdate', onWebTime)
      }
    }
    root.classList.add('motion-ready')

    // 1. Hiện dần khi vào màn hình (một lần). [data-mark] = nét bút dạ quang quét qua cụm cần chú ý (noticing).
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
    const markIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            markIo.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -22% 0px', threshold: 1 },
    )
    root.querySelectorAll('[data-mark]').forEach((el) => markIo.observe(el))

    // Video trang học: chỉ chạy khi đang thấy trên màn hình (tiết kiệm pin + dữ liệu điện thoại)
    const vio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement
          if (e.isIntersecting) {
            v.preload = 'auto'
            v.play().catch(() => {
              v.controls = true
            })
          } else v.pause()
        }
      },
      { threshold: 0.35 },
    )
    videos.forEach((v) => vio.observe(v))
    const fills = Array.from(root.querySelectorAll<HTMLElement>('[data-fill]'))

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

      // 4b. Đường thời gian chương 1: đoạn "6 tháng" tô dần theo cuộn
      for (const f of fills) {
        const r = f.getBoundingClientRect()
        if (r.bottom < -50 || r.top > vh + 50) continue
        f.style.setProperty('--fill', clamp((vh * 0.92 - r.top) / (vh * 0.42)).toFixed(3))
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
      markIo.disconnect()
      webItems.forEach((it) => it.removeEventListener('click', onWebClick))
      webVideo?.removeEventListener('timeupdate', onWebTime)
      vio.disconnect()
    }
  }, [])
  return null
}
