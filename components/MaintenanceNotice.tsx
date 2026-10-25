'use client'

// Hộp "Web đang được nâng cấp" (Long 25/10/2026) — báo học viên/phụ huynh trong thời gian chuyển web sang máy chủ mới (Cloudflare).
// CHỈ NHẮC, không chặn: bạn bấm "Đã hiểu" (hoặc bấm ra ngoài / phím Esc) là đóng và làm bài bình thường. Mỗi lượt vào
// web hiện một lần (nhớ trong sessionStorage). Bản chạy trên Cloudflare tự ẩn
// (NEXT_PUBLIC_PLATFORM=cloudflare lúc build). Tắt hẳn: đổi MAINTENANCE_ON thành false.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

const MAINTENANCE_ON = true
const STORAGE_KEY = 'bao-tri-2026-10-da-xem'

const noSubscribe = () => () => {}

/** Có nên hiện hộp không — đọc lúc chạy trên trình duyệt (máy chủ luôn trả false để không lệch lúc hydrate). */
function shouldShow(): boolean {
  if (!MAINTENANCE_ON || process.env.NEXT_PUBLIC_PLATFORM === 'cloudflare') return false
  try {
    return !sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return true // trình duyệt chặn sessionStorage — vẫn hiện, chỉ là không nhớ được
  }
}

export default function MaintenanceNotice() {
  const eligible = useSyncExternalStore(noSubscribe, shouldShow, () => false)
  const [dismissed, setDismissed] = useState(false)
  const open = eligible && !dismissed
  const buttonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // bỏ qua
    }
    setDismissed(true)
  }, [])

  useEffect(() => {
    if (!open) return
    buttonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        background: 'rgba(11, 61, 92, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bao-tri-tieu-de"
        aria-describedby="bao-tri-noi-dung"
        onClick={(e) => e.stopPropagation()}
        className="maintenance-card"
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 20,
          padding: '28px 24px 22px',
          boxShadow: '0 20px 50px rgba(11, 61, 92, 0.25)',
          color: '#2c2c2a',
          textAlign: 'left',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(29, 158, 117, 0.12)',
            color: '#1d9e75',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h2 id="bao-tri-tieu-de" style={{ margin: 0, fontSize: 21, lineHeight: 1.3, fontWeight: 700, color: '#0b3d5c' }}>
          Web đang được nâng cấp
        </h2>
        <p id="bao-tri-noi-dung" style={{ margin: '10px 0 0', fontSize: 16, lineHeight: 1.6, color: '#44443f' }}>
          Thầy Long đang chuyển web sang máy chủ mới cho chạy nhanh và ổn định hơn. Trong lúc này, nếu trang chậm hoặc báo
          lỗi, bạn đợi vài phút rồi thử lại nhé. Bài bạn đã làm vẫn được lưu đầy đủ.
        </p>
        <button
          ref={buttonRef}
          type="button"
          onClick={close}
          style={{
            marginTop: 22,
            width: '100%',
            minHeight: 48,
            border: 'none',
            borderRadius: 14,
            background: '#1d9e75',
            color: '#ffffff',
            fontSize: 17,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Đã hiểu
        </button>
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .maintenance-card { animation: maintenance-in 220ms ease-out; }
        }
        .maintenance-card button:focus { outline: none; }
        .maintenance-card button:focus-visible { outline: 3px solid rgba(29, 158, 117, 0.35); outline-offset: 2px; }
        @keyframes maintenance-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
