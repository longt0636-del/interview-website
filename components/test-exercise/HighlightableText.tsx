'use client'

import { useRef } from 'react'

export interface HighlightRange {
  start: number
  end: number
}

interface HighlightableTextProps {
  text: string
  ranges: HighlightRange[]
  onHighlight: (start: number, end: number) => void
  onRemove: (index: number) => void
}

function getOffset(root: HTMLElement, node: Node, offset: number): number {
  let total = 0
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()
  while (current) {
    if (current === node) return total + offset
    total += current.textContent?.length ?? 0
    current = walker.nextNode()
  }
  return total
}

export function HighlightableText({ text, ranges, onHighlight, onRemove }: HighlightableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  function handleSelectionEnd() {
    const sel = window.getSelection()
    const root = ref.current
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !root) return
    const range = sel.getRangeAt(0)
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return
    const start = getOffset(root, range.startContainer, range.startOffset)
    const end = getOffset(root, range.endContainer, range.endOffset)
    sel.removeAllRanges()
    if (end > start) onHighlight(start, end)
  }

  const sorted = ranges.map((r, i) => ({ ...r, i })).sort((a, b) => a.start - b.start)
  const segments: { text: string; highlightIndex: number | null }[] = []
  let cursor = 0
  for (const r of sorted) {
    if (r.start > cursor) segments.push({ text: text.slice(cursor, r.start), highlightIndex: null })
    segments.push({ text: text.slice(r.start, r.end), highlightIndex: r.i })
    cursor = Math.max(cursor, r.end)
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightIndex: null })

  return (
    <p
      ref={ref}
      onMouseUp={handleSelectionEnd}
      onTouchEnd={handleSelectionEnd}
      className="text-base leading-relaxed"
      style={{ color: 'var(--ink)', userSelect: 'text' }}
    >
      {segments.map((seg, idx) =>
        seg.highlightIndex !== null ? (
          <mark
            key={idx}
            onClick={() => onRemove(seg.highlightIndex!)}
            className="cursor-pointer rounded-sm"
            style={{ background: '#FDE68A', padding: '0 1px' }}
            title="Bấm để bỏ đánh dấu"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={idx}>{seg.text}</span>
        )
      )}
    </p>
  )
}
