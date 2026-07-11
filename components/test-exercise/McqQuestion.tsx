'use client'

import type { CSSProperties } from 'react'
import type { McqItem } from '@/lib/test2-content'

interface McqQuestionProps {
  items: McqItem[]
  answers: Record<number, string>
  onChange: (number: number, letter: string) => void
  showResults: boolean
  correctAnswers: Record<number, string>
}

export function McqQuestion({ items, answers, onChange, showResults, correctAnswers }: McqQuestionProps) {
  return (
    <div className="space-y-5">
      {items.map((item) => {
        const selected = answers[item.number] ?? ''
        const correctLetter = correctAnswers[item.number]

        return (
          <div key={item.number} id={`q-${item.number}`} className="scroll-mt-28">
            <div className="flex items-start gap-2.5 mb-3">
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold font-mono shrink-0 mt-0.5"
                style={{ background: 'var(--mint)', color: 'var(--navy)' }}
              >
                {item.number}
              </span>
              <p className="text-base leading-snug font-medium" style={{ color: 'var(--ink)' }}>
                {item.prompt}
              </p>
            </div>
            <div className="pl-8 space-y-2">
              {item.options.map((opt) => {
                const isSelected = selected === opt.letter
                const isCorrectLetter = opt.letter === correctLetter

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

                const showBadge = opt.letter !== opt.label

                return (
                  <button
                    key={opt.letter}
                    type="button"
                    disabled={showResults}
                    onClick={() => onChange(item.number, opt.letter)}
                    className="w-full flex items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-left text-base transition-colors disabled:cursor-default"
                    style={style}
                  >
                    {showBadge && (
                      <span
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold font-mono shrink-0"
                        style={{
                          background: isSelected || (showResults && isCorrectLetter) ? 'var(--teal)' : '#F3F4F6',
                          color: isSelected || (showResults && isCorrectLetter) ? '#fff' : 'var(--navy)',
                        }}
                      >
                        {opt.letter}
                      </span>
                    )}
                    <span className="font-semibold" style={{ color: showBadge ? 'var(--ink)' : undefined }}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
