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
            {item.imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageSrc}
                alt={item.imageAlt || `Hình của câu ${item.number}`}
                className="block w-full max-w-md h-auto rounded-lg border border-gray-200 mb-3 ml-0 sm:ml-8"
                loading="lazy"
              />
            )}
            <div className={item.imageSrc ? 'pl-0 sm:pl-8 grid grid-cols-3 gap-2 max-w-md' : 'pl-8 space-y-2'}>
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
                    className={`w-full flex items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-base transition-colors disabled:cursor-default min-h-[44px] ${item.imageSrc ? 'justify-center text-center' : 'text-left'}`}
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
