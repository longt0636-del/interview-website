'use client'

import type { FillPart } from '@/lib/test2-content'
import { isAnswerCorrect } from './normalize'

interface BlankFillTextProps {
  blocks: FillPart[][]
  answers: Record<number, string>
  onChange: (number: number, value: string) => void
  showResults: boolean
  correctAnswers: Record<number, string[]>
  asLines?: boolean
}

export function BlankFillText({
  blocks,
  answers,
  onChange,
  showResults,
  correctAnswers,
  asLines = false,
}: BlankFillTextProps) {
  return (
    <div className={asLines ? 'space-y-3' : 'space-y-5'}>
      {blocks.map((block, blockIdx) => (
        <p key={blockIdx} className="text-base leading-relaxed" style={{ color: 'var(--ink)' }}>
          {block.map((part, partIdx) => {
            if (part.type === 'text') {
              return <span key={partIdx}>{part.value}</span>
            }
            const num = part.number
            const value = answers[num] ?? ''
            const accepted = correctAnswers[num] ?? []
            const correct = showResults ? isAnswerCorrect(value, accepted) : null

            return (
              <span
                key={partIdx}
                id={`q-${num}`}
                className="inline-flex items-center gap-1.5 align-middle scroll-mt-28 mx-1"
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold font-mono shrink-0"
                  style={{ background: 'var(--mint)', color: 'var(--navy)' }}
                >
                  {num}
                </span>
                <input
                  type="text"
                  value={value}
                  disabled={showResults}
                  onChange={(e) => onChange(num, e.target.value)}
                  placeholder="..."
                  className="border-b-2 px-2 py-1 text-base outline-none w-32 font-sans disabled:opacity-100"
                  style={{
                    borderColor: showResults
                      ? correct
                        ? 'var(--teal)'
                        : '#EF4444'
                      : 'var(--teal-light)',
                    background: showResults ? (correct ? 'var(--mint)' : '#FEF2F2') : 'transparent',
                    color: 'var(--navy)',
                  }}
                />
                {showResults && !correct && (
                  <span className="text-sm font-medium" style={{ color: 'var(--teal)' }}>
                    ({accepted[0]})
                  </span>
                )}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}
