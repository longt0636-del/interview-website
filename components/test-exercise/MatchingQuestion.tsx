'use client'

import type { CSSProperties } from 'react'
import type { MatchingOption, MatchingItem } from '@/lib/test2-content'

interface MatchingQuestionProps {
  optionsTitle: string
  options: MatchingOption[]
  items: MatchingItem[]
  answers: Record<number, string>
  onChange: (number: number, letter: string) => void
  showResults: boolean
  correctAnswers: Record<number, string>
}

export function MatchingQuestion({
  optionsTitle,
  options,
  items,
  answers,
  onChange,
  showResults,
  correctAnswers,
}: MatchingQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5 border" style={{ background: 'var(--mint)', borderColor: 'var(--teal-light)' }}>
        <p className="text-sm font-semibold font-sans mb-2" style={{ color: 'var(--navy)' }}>
          {optionsTitle}
        </p>
        <ul className="space-y-1.5">
          {options.map((opt) => (
            <li key={opt.letter} className="text-base font-sans" style={{ color: 'var(--ink)' }}>
              <span className="font-semibold">{opt.letter}.</span> {opt.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const selected = answers[item.number] ?? ''
          const correctLetter = correctAnswers[item.number]

          return (
            <div key={item.number} id={`q-${item.number}`} className="flex flex-col gap-2.5 scroll-mt-28">
              <div className="flex items-start gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold font-mono shrink-0 mt-0.5"
                  style={{ background: 'var(--mint)', color: 'var(--navy)' }}
                >
                  {item.number}
                </span>
                <p className="text-base leading-snug" style={{ color: 'var(--ink)' }}>
                  {item.prompt}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pl-8">
                {options.map((opt) => {
                  const isSelected = selected === opt.letter
                  const isCorrectLetter = opt.letter === correctLetter

                  let style: CSSProperties = {
                    borderColor: 'var(--teal-light)',
                    color: 'var(--navy)',
                    background: 'transparent',
                  }
                  if (showResults) {
                    if (isCorrectLetter) {
                      style = { borderColor: 'var(--teal)', background: 'var(--mint)', color: 'var(--navy)' }
                    } else if (isSelected) {
                      style = { borderColor: '#EF4444', background: '#FEF2F2', color: '#B91C1C' }
                    } else {
                      style = { borderColor: '#E5E7EB', background: 'transparent', color: '#9CA3AF' }
                    }
                  } else if (isSelected) {
                    style = { borderColor: 'var(--teal)', background: 'var(--teal)', color: '#fff' }
                  }

                  return (
                    <button
                      key={opt.letter}
                      type="button"
                      disabled={showResults}
                      onClick={() => onChange(item.number, opt.letter)}
                      className="w-11 h-11 rounded-lg border-2 text-base font-semibold font-mono transition-colors disabled:cursor-default"
                      style={style}
                    >
                      {opt.letter}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
