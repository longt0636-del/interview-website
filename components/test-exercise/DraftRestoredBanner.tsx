'use client'

import { formatSavedAt } from '@/lib/test-draft'

interface DraftRestoredBannerProps {
  savedAt: number
  onDiscard: () => void
}

/**
 * Hiện khi trang tự dựng lại bài làm dở từ lần trước. Học viên cần biết rõ là bài
 * cũ đã được khôi phục (chứ không phải trang bị lỗi hiện dữ liệu lạ), và cần có
 * đường thoát rõ ràng nếu muốn làm lại từ đầu.
 */
export function DraftRestoredBanner({ savedAt, onDiscard }: DraftRestoredBannerProps) {
  return (
    <div
      className="rounded-xl border-2 p-4 mb-6 flex flex-wrap items-center justify-between gap-3"
      style={{ background: 'var(--mint)', borderColor: 'var(--teal)' }}
    >
      <div className="min-w-0">
        <p className="font-semibold font-sans text-sm" style={{ color: 'var(--navy)' }}>
          ✓ Đã khôi phục bài làm dở của bạn
        </p>
        <p className="text-xs font-sans mt-0.5" style={{ color: 'var(--navy)', opacity: 0.75 }}>
          Lưu lần cuối lúc {formatSavedAt(savedAt)}. Bạn làm tiếp từ chỗ đang dở, không phải làm lại.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          const ok = window.confirm(
            'Xoá toàn bộ bài làm đã lưu và bắt đầu lại từ đầu?\n\nThao tác này không hoàn tác được.'
          )
          if (ok) onDiscard()
        }}
        className="shrink-0 text-xs font-semibold font-sans underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--navy)' }}
      >
        Xoá và làm lại từ đầu
      </button>
    </div>
  )
}
