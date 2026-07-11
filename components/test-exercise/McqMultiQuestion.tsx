'use client'

import type { CSSProperties } from 'react'
import type { McqMultiGroup } from '@/lib/test2-content'

interface McqMultiQuestionProps {
  group: McqMultiGroup
  selected: string[]
  onToggle: (letter: string) => void
  showResults: boolean
}

export function McqMultiQuestion({ group, selected, onToggle, showResults }: McqMultiQuestionProps) {
  const [n1, n2] = group.numbers

  return (
    <div>
      <div className="flex items-start gap-2.5 mb-1">
        <span
          className="inline-flex items-center justify-center h-6 px-2 rounded-full text-sm font-semibold font-mono shrink-0 mt-0.5"
          style={{ background: 'var(--mint)', color: 'var(--navy)' }}
        >
          {n1}-{n2}
        </span>
        <p className="text-base leading-snug font-medium" style={{ color: 'var(--ink)' }}>
          {group.prompt}
        </p>
      </div>
      <p className="text-sm font-sans pl-8 mb-3" style={{ color: 'var(--ink)', opacity: 0.6 }}>
        Chọn đúng 2 đáp án
      </p>
      <div className="pl-8 space-y-2">
        {group.options.map((opt) => {
          const isSelected = selected.includes(opt.letter)
          const isCorrectLetter = group.answers.includes(opt.letter)
          const disableUnselected = !showResults && !isSelected && selected.length >= 2

          let style: CSSProperties = {
            borderColor: '#E5E7EB',
            background: 'transparent',
          }
          if (showResults) {
            if (isCorrectLetter) {
              style = { borderColor: 'var(--teal)', background: 'var(--mint)' }
            } else if (isSelected) {
              style = { borderColor: '#EF4444', background: '#FEF2F2' }
            }
          } else if (isSelected) {
            style = { borderColor: 'var(--teal)', background: 'var(--mint)' }
          }

          return (
            <button
              key={opt.letter}
              type="button"
              disabled={showResults || disableUnselected}
              onClick={() => onToggle(opt.letter)}
              className="w-full flex items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-left text-base transition-colors disabled:cursor-default"
              style={{ ...style, opacity: disableUnselected ? 0.45 : 1 }}
            >
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-semibold font-mono shrink-0"
                style={{
                  background: isSelected || (showResults && isCorrectLetter) ? 'var(--teal)' : '#F3F4F6',
                  color: isSelected || (showResults && isCorrectLetter) ? '#fff' : 'var(--navy)',
                }}
              >
                {opt.letter}
              </span>
              <span style={{ color: 'var(--ink)' }}>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
