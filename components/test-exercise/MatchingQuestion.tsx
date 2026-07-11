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
  optionsImage?: string
  picker?: 'buttons' | 'dropdown' | 'grid'
  layout?: 'stacked' | 'split'
}

export function MatchingQuestion({
  optionsTitle,
  options,
  items,
  answers,
  onChange,
  showResults,
  correctAnswers,
  optionsImage,
  picker = 'buttons',
  layout = 'stacked',
}: MatchingQuestionProps) {
  const optionsPanel = optionsImage ? (
    <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: 'var(--teal-light)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={optionsImage} alt={optionsTitle} className="w-full h-auto" />
    </div>
  ) : (
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
  )

  const gridPanel = (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5E7EB' }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: 'var(--mint)' }}>
            <th className="text-left px-3 py-2.5 text-sm font-semibold font-sans" style={{ color: 'var(--navy)' }}>
              &nbsp;
            </th>
            {options.map((opt) => (
              <th
                key={opt.letter}
                className="px-3 py-2.5 text-sm font-semibold font-mono text-center"
                style={{ color: 'var(--navy)' }}
              >
                {opt.letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const selected = answers[item.number] ?? ''
            const correctLetter = correctAnswers[item.number]

            return (
              <tr key={item.number} id={`q-${item.number}`} className="scroll-mt-28 border-t" style={{ borderColor: '#E5E7EB' }}>
                <td className="px-3 py-2.5 text-base font-sans whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                  <span className="font-mono font-semibold mr-1.5" style={{ color: 'var(--navy)' }}>
                    {item.number}
                  </span>
                  {item.prompt}
                </td>
                {options.map((opt) => {
                  const isSelected = selected === opt.letter
                  const isCorrectLetter = opt.letter === correctLetter

                  let dotStyle: CSSProperties = { borderColor: '#D1D5DB', background: 'transparent' }
                  if (showResults) {
                    if (isCorrectLetter) {
                      dotStyle = { borderColor: 'var(--teal)', background: 'var(--teal)' }
                    } else if (isSelected) {
                      dotStyle = { borderColor: '#EF4444', background: '#EF4444' }
                    }
                  } else if (isSelected) {
                    dotStyle = { borderColor: 'var(--teal)', background: 'var(--teal)' }
                  }

                  return (
                    <td key={opt.letter} className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        disabled={showResults}
                        onClick={() => onChange(item.number, opt.letter)}
                        aria-label={`${item.prompt}: ${opt.letter}`}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors disabled:cursor-default"
                        style={dotStyle}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const itemsPanel = (
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

            {picker === 'dropdown' ? (
              <div className="pl-8">
                <select
                  value={selected}
                  disabled={showResults}
                  onChange={(e) => onChange(item.number, e.target.value)}
                  className="w-full max-w-md border-2 rounded-lg px-3 py-2.5 text-base font-sans outline-none disabled:opacity-100 bg-white"
                  style={{
                    borderColor: showResults
                      ? selected === correctLetter
                        ? 'var(--teal)'
                        : '#EF4444'
                      : 'var(--teal-light)',
                    background: showResults ? (selected === correctLetter ? 'var(--mint)' : '#FEF2F2') : '#fff',
                    color: 'var(--navy)',
                  }}
                >
                  <option value="">— Chọn đáp án —</option>
                  {options.map((opt) => (
                    <option key={opt.letter} value={opt.letter}>
                      {opt.letter}. {opt.label}
                    </option>
                  ))}
                </select>
                {showResults && selected !== correctLetter && (
                  <p className="text-sm font-medium mt-1.5" style={{ color: 'var(--teal)' }}>
                    Đáp án đúng: {correctLetter}. {options.find((o) => o.letter === correctLetter)?.label}
                  </p>
                )}
              </div>
            ) : (
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
                      className="min-w-11 h-11 px-2 rounded-lg border-2 text-base font-semibold font-mono transition-colors disabled:cursor-default"
                      style={style}
                    >
                      {opt.letter}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const mainPanel = picker === 'grid' ? gridPanel : itemsPanel

  if (layout === 'split') {
    return (
      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        <div className="md:w-2/5 md:shrink-0 md:sticky md:top-4">{optionsPanel}</div>
        <div className="flex-1 min-w-0">{mainPanel}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {picker !== 'grid' && optionsPanel}
      {mainPanel}
    </div>
  )
}
