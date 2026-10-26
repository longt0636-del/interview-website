import { cn } from '@/lib/utils'

/**
 * Nút "Bước 1: Điền form khảo sát" có hiệu ứng mời bấm (26/10/2026): vòng sáng lan ra,
 * vệt sáng lướt qua và một bàn tay chạm nhẹ vào nút. Hiệu ứng nằm trong app/globals.css
 * (các lớp .step1-*), tự tắt khi máy bật "giảm chuyển động".
 */
export function StepOneCta({
  href,
  compact = false,
  className,
}: {
  href: string
  /** Bản nhỏ hơn, dùng trong khung học phí và cuối trang */
  compact?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Bước 1: Điền form khảo sát, chỉ mất khoảng 5 phút (mở trong tab mới)"
      className={cn(
        'step1 group relative isolate inline-flex rounded-2xl',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5DCAA5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className,
      )}
    >
      <span aria-hidden="true" className="step1-ring" />
      <span aria-hidden="true" className="step1-ring step1-ring--late" />

      <span
        className={cn(
          'step1-body relative flex w-full items-center overflow-hidden rounded-2xl font-sans font-semibold text-white',
          compact ? 'gap-2.5' : 'gap-3',
          compact ? 'min-h-12 py-2 pl-2 pr-4 text-sm' : 'h-14 pl-2.5 pr-5 text-[15px]',
        )}
        style={{
          background: 'var(--teal)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 10px 28px rgba(29,158,117,0.38)',
        }}
      >
        <span aria-hidden="true" className="step1-shine" />
        <span
          aria-hidden="true"
          className={cn(
            'relative flex shrink-0 items-center justify-center rounded-xl bg-white font-mono font-bold',
            compact ? 'h-8 w-8 text-sm' : 'h-9 w-9 text-base',
          )}
          style={{ color: 'var(--teal)' }}
        >
          1
        </span>
        <span className={cn('relative', compact ? 'min-w-0 leading-snug' : 'whitespace-nowrap')}>
          Bước 1: Điền form khảo sát
        </span>
        <svg
          aria-hidden="true"
          className={cn('relative ml-auto h-4 w-4 shrink-0 text-white/90', compact && 'hidden sm:block')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10v10M7 17 17 7" />
        </svg>
      </span>

      {/* Nhãn "5 phút" gắn ở góc nút */}
      <span
        aria-hidden="true"
        className="step1-badge absolute -top-2.5 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[11px] font-bold"
        style={{ background: 'var(--amber)', color: '#3B2400', boxShadow: '0 4px 12px rgba(239,159,39,0.35)' }}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        5 phút
      </span>

      {/* Bàn tay chạm vào nút */}
      <span aria-hidden="true" className="step1-hand absolute -bottom-6 right-[16%]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" stroke="#0B3D5C" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3.5a1.5 1.5 0 0 1 3 0V9.5a1.5 1.5 0 0 1 3 0V10.5a1.5 1.5 0 0 1 3 0V11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-1.5c-2.2 0-3.6-.8-4.8-2l-3.4-3.6a1.5 1.5 0 0 1 2.1-2.1L7 15.5Z" />
          <path d="M10 9.5V13M13 10.5v3M16 11.5V14" fill="none" />
        </svg>
      </span>
    </a>
  )
}
