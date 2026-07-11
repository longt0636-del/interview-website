'use client'

import { useState, useEffect } from 'react'
import type { TestSection, McqMultiGroup } from '@/lib/test2-content'
import { BlankFillText } from './BlankFillText'
import { MatchingQuestion } from './MatchingQuestion'
import { McqQuestion } from './McqQuestion'
import { McqMultiQuestion } from './McqMultiQuestion'
import { HighlightableText, type HighlightRange } from './HighlightableText'
import { isAnswerCorrect } from './normalize'

function parseMultiSelection(raw: string | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface NextSectionInfo {
  id: TestSection['id']
  label: string
}

interface ReadingListeningExerciseProps {
  section: TestSection
  nextSection?: NextSectionInfo | null
  onComplete: (score: number, total: number) => void
  onGoToNext?: (id: TestSection['id']) => void
  onClose: () => void
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function ReadingListeningExercise({
  section,
  nextSection,
  onComplete,
  onGoToNext,
  onClose,
}: ReadingListeningExerciseProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [mobileTab, setMobileTab] = useState<'content' | 'questions'>('content')
  const [highlights, setHighlights] = useState<Record<number, HighlightRange[]>>({})
  const hasPassage = !!section.passageParagraphs

  function addHighlight(paraIdx: number, start: number, end: number) {
    setHighlights((prev) => {
      const merged = [...(prev[paraIdx] ?? []), { start, end }]
        .sort((a, b) => a.start - b.start)
        .reduce<HighlightRange[]>((acc, r) => {
          const last = acc[acc.length - 1]
          if (last && r.start <= last.end) {
            last.end = Math.max(last.end, r.end)
          } else {
            acc.push({ ...r })
          }
          return acc
        }, [])
      return { ...prev, [paraIdx]: merged }
    })
  }

  function removeHighlight(paraIdx: number, index: number) {
    setHighlights((prev) => ({
      ...prev,
      [paraIdx]: (prev[paraIdx] ?? []).filter((_, i) => i !== index),
    }))
  }

  useEffect(() => {
    if (submitted) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [submitted])

  function handleAnswerChange(num: number, value: string) {
    setAnswers((prev) => ({ ...prev, [num]: value }))
  }

  function computeScore() {
    let total = 0
    for (const group of section.groups) {
      if (group.kind === 'fill') {
        for (const key of Object.keys(group.answers)) {
          const num = Number(key)
          if (isAnswerCorrect(answers[num] ?? '', group.answers[num])) total++
        }
      } else if (group.kind === 'mcqMulti') {
        const selected = parseMultiSelection(answers[group.numbers[0]])
        total += selected.filter((letter) => group.answers.includes(letter)).length
      } else {
        for (const key of Object.keys(group.answers)) {
          const num = Number(key)
          if ((answers[num] ?? '') === group.answers[num]) total++
        }
      }
    }
    return total
  }

  function handleMultiToggle(group: McqMultiGroup, letter: string) {
    const current = parseMultiSelection(answers[group.numbers[0]])
    let next: string[]
    if (current.includes(letter)) {
      next = current.filter((l) => l !== letter)
    } else if (current.length >= 2) {
      return
    } else {
      next = [...current, letter]
    }
    const raw = JSON.stringify(next)
    handleAnswerChange(group.numbers[0], raw)
    handleAnswerChange(group.numbers[1], raw)
  }

  function handleComplete() {
    const result = computeScore()
    setScore(result)
    setSubmitted(true)
    onComplete(result, section.totalQuestions)
  }

  function handleClose() {
    if (!submitted && Object.keys(answers).length > 0) {
      const ok = window.confirm('Thoát mà không lưu kết quả phần này?')
      if (!ok) return
    }
    onClose()
  }

  function scrollToQuestion(num: number) {
    setMobileTab('questions')
    requestAnimationFrame(() => {
      document.getElementById(`q-${num}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const leftVisibility = mobileTab === 'content' ? 'flex' : 'hidden md:flex'
  const rightVisibility = mobileTab === 'questions' ? 'flex' : 'hidden md:flex'

  const questionsContent = (
    <>
      {submitted && (
        <div
          className="rounded-xl p-5 mb-6 border-2 text-center"
          style={{ background: 'var(--mint)', borderColor: 'var(--teal)' }}
        >
          <p className="font-serif font-bold text-2xl" style={{ color: 'var(--navy)' }}>
            {score} / {section.totalQuestions}
          </p>
          <p className="text-sm font-sans mt-1" style={{ color: 'var(--navy)' }}>
            câu đúng
          </p>
        </div>
      )}

      <div className="space-y-10">
        {section.groups.map((group, i) => (
          <div key={i}>
            {group.kind !== 'mcqMulti' && group.title && (
              <p
                className="text-sm font-semibold font-sans uppercase tracking-wide mb-2"
                style={{ color: 'var(--teal)' }}
              >
                {group.title}
              </p>
            )}
            <p className="text-base italic mb-5" style={{ color: 'var(--ink)', opacity: 0.75 }}>
              {group.instruction}
            </p>
            {group.kind === 'fill' && (
              <>
                {group.imageSrc && (
                  <div className="rounded-xl border overflow-hidden bg-white mb-5" style={{ borderColor: '#E5E7EB' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={group.imageSrc} alt={group.imageAlt || ''} className="w-full h-auto" />
                  </div>
                )}
                <BlankFillText
                  blocks={group.blocks}
                  answers={answers}
                  onChange={handleAnswerChange}
                  showResults={submitted}
                  correctAnswers={group.answers}
                  asLines={group.asLines ?? !hasPassage}
                  wordBank={group.wordBank}
                />
              </>
            )}
            {group.kind === 'matching' && (
              <MatchingQuestion
                optionsTitle={group.optionsTitle}
                options={group.options}
                items={group.items}
                answers={answers}
                onChange={handleAnswerChange}
                showResults={submitted}
                correctAnswers={group.answers}
                optionsImage={group.optionsImage}
                picker={group.picker}
                layout={group.layout}
              />
            )}
            {group.kind === 'mcq' && (
              <McqQuestion
                items={group.items}
                answers={answers}
                onChange={handleAnswerChange}
                showResults={submitted}
                correctAnswers={group.answers}
              />
            )}
            {group.kind === 'mcqMulti' && (
              <>
                <span id={`q-${group.numbers[0]}`} className="block scroll-mt-28" />
                <span id={`q-${group.numbers[1]}`} className="block scroll-mt-28" />
                <McqMultiQuestion
                  group={group}
                  selected={parseMultiSelection(answers[group.numbers[0]])}
                  onToggle={(letter) => handleMultiToggle(group, letter)}
                  showResults={submitted}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--off-white)' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5 border-b shrink-0"
        style={{ background: '#fff', borderColor: '#E5E7EB' }}
      >
        <button
          onClick={handleClose}
          className="text-base font-medium font-sans flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: 'var(--navy)' }}
        >
          ← Đóng
        </button>
        <h2 className="text-base font-semibold font-sans truncate" style={{ color: 'var(--navy)' }}>
          {section.label}
        </h2>
        <span
          className="inline-flex items-center gap-1.5 text-base font-mono font-semibold px-3.5 py-1.5 rounded-full shrink-0"
          style={{ background: 'var(--mint)', color: 'var(--navy)' }}
        >
          ⏱ {formatTime(seconds)}
        </span>
      </div>

      {/* Mobile tab switcher (Reading only — Listening is single column already) */}
      {hasPassage && (
        <div className="flex md:hidden border-b shrink-0" style={{ borderColor: '#E5E7EB', background: '#fff' }}>
          <button
            onClick={() => setMobileTab('content')}
            className="flex-1 py-3 text-base font-semibold font-sans"
            style={{
              color: mobileTab === 'content' ? 'var(--teal)' : '#9CA3AF',
              borderBottom: mobileTab === 'content' ? '2px solid var(--teal)' : '2px solid transparent',
            }}
          >
            Đề bài
          </button>
          <button
            onClick={() => setMobileTab('questions')}
            className="flex-1 py-3 text-base font-semibold font-sans"
            style={{
              color: mobileTab === 'questions' ? 'var(--teal)' : '#9CA3AF',
              borderBottom: mobileTab === 'questions' ? '2px solid var(--teal)' : '2px solid transparent',
            }}
          >
            Câu hỏi
          </button>
        </div>
      )}

      {/* Main content */}
      {hasPassage ? (
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: passage */}
          <div
            className={`${leftVisibility} flex-1 md:w-1/2 flex-col overflow-y-auto p-6 border-r`}
            style={{ borderColor: '#E5E7EB' }}
          >
            {section.passageTitle && (
              <h3 className="font-serif font-bold text-xl mb-2" style={{ color: 'var(--navy)' }}>
                {section.passageTitle}
              </h3>
            )}
            <p className="text-sm font-sans mb-4" style={{ color: 'var(--ink)', opacity: 0.55 }}>
              💡 Kéo chuột để bôi đen câu quan trọng — bấm vào phần đã tô để bỏ đánh dấu.
            </p>
            {section.passageParagraphs?.map((p, i) => (
              <div key={i} className="mb-4">
                <HighlightableText
                  text={p}
                  ranges={highlights[i] ?? []}
                  onHighlight={(start, end) => addHighlight(i, start, end)}
                  onRemove={(idx) => removeHighlight(i, idx)}
                />
              </div>
            ))}
          </div>

          {/* Right: questions */}
          <div className={`${rightVisibility} flex-1 md:w-1/2 flex-col overflow-y-auto p-6`}>
            {questionsContent}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Audio bar — full width, always visible at top */}
          {section.audioSrc && (
            <div className="shrink-0 p-4 border-b" style={{ background: '#fff', borderColor: '#E5E7EB' }}>
              <div className="max-w-4xl mx-auto">
                <p className="text-sm font-semibold font-sans mb-2" style={{ color: 'var(--navy)' }}>
                  🎧 Nghe audio (có thể tua lại nhiều lần)
                </p>
                <audio controls src={section.audioSrc} className="w-full" />
              </div>
            </div>
          )}
          {/* Questions — full width below */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto">{questionsContent}</div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="border-t px-5 py-3.5 shrink-0" style={{ background: '#fff', borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 flex-1 overflow-x-auto">
            {Array.from({ length: section.totalQuestions }, (_, i) => i + 1).map((num) => {
              const answered = !!answers[num]
              return (
                <button
                  key={num}
                  onClick={() => scrollToQuestion(num)}
                  className="w-9 h-9 rounded-full text-sm font-semibold font-mono border-2 shrink-0 transition-colors"
                  style={{
                    borderColor: answered ? 'var(--teal)' : '#D1D5DB',
                    background: answered ? 'var(--teal)' : 'transparent',
                    color: answered ? '#fff' : '#6B7280',
                  }}
                >
                  {num}
                </button>
              )
            })}
          </div>
          {!submitted ? (
            <button
              onClick={handleComplete}
              className="shrink-0 px-6 py-3 rounded-xl text-white font-semibold font-sans text-base transition-opacity hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Hoàn thành
            </button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl font-semibold font-sans text-base border-2 transition-opacity hover:opacity-80"
                style={{ borderColor: 'var(--navy)', color: 'var(--navy)', background: 'transparent' }}
              >
                Quay lại
              </button>
              {nextSection && (
                <button
                  onClick={() => onGoToNext?.(nextSection.id)}
                  className="px-6 py-3 rounded-xl text-white font-semibold font-sans text-base transition-opacity hover:opacity-90"
                  style={{ background: 'var(--teal)' }}
                >
                  Tiếp tục: {nextSection.label} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
