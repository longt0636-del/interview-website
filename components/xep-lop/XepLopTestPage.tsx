'use client'

// Trang làm bài XẾP LỚP theo cấp (17/11/2026) — dùng chung cho /test/34, /test/45, /test/56, /test/451, /test/561.
// Phần máy chấm (Nghe, Đọc, trắc nghiệm, điền) mở bằng khung ReadingListeningExercise có sẵn; phần thầy chấm (chép chính tả,
// sửa lỗi, dịch, đoạn văn, Task 2) là ô viết ngay trên trang; phần Nói ghi âm ngay trên trang (SpeakingRecorder).
// Bài làm tự lưu trên máy (giống Test 2/3). Nộp bài → /api/submit-test với testLevel = mã bài + xepLop (điểm theo mục).
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReadingListeningExercise } from '@/components/test-exercise/ReadingListeningExercise'
import { DraftRestoredBanner } from '@/components/test-exercise/DraftRestoredBanner'
import { PromiseResubmit } from '@/components/ui/promise-resubmit'
import { BookOpenIcon, HeadphonesIcon, PencilSquareIcon, MicIcon, WarningIcon } from '@/components/ui/icons'
import { isAnswerCorrect } from '@/components/test-exercise/normalize'
import { SpeakingRecorder } from './SpeakingRecorder'
import type { TestSection } from '@/lib/test2-content'
import type { XepLopTest, OpenTask } from '@/lib/xep-lop/types'
import type { Diem, XepLopPayload } from '@/lib/xep-lop/goi-y'
import {
  loadStudentInfo,
  loadDraft,
  saveDraft,
  clearDraft,
  type StudentInfo,
  type ExerciseState,
} from '@/lib/test-draft'

// Câu dùng để tính nhóm điểm phụ (gửi kèm để gợi ý lớp): khớp đề trong bản giáo viên.
const GROUPS: Record<number, Record<string, number[]>> = {
  34: { san: [1, 2, 3, 4, 5, 16, 17, 18, 19] },
  45: { 'thi-kho': [18, 21, 23] },
  451: { m2: [47, 48, 49], m3: [50, 51, 52], m4: [53, 54, 55] },
}

function answerKey(section: TestSection): Record<number, string[]> {
  const key: Record<number, string[]> = {}
  for (const g of section.groups) {
    if (g.kind === 'fill') for (const [n, v] of Object.entries(g.answers)) key[+n] = v
    if (g.kind === 'mcq' || g.kind === 'matching') for (const [n, v] of Object.entries(g.answers)) key[+n] = [v]
  }
  return key
}

function wordCount(t: string) {
  return t.trim() ? t.trim().split(/\s+/).length : 0
}

const ICON = { nghe: HeadphonesIcon, doc: BookOpenIcon, 'ngu-phap': PencilSquareIcon, 'tu-vung': BookOpenIcon }

export function XepLopTestPage({ test }: { test: XepLopTest }) {
  const router = useRouter()
  const code = test.code
  const autoParts = useMemo(() => test.parts.flatMap((p) => (p.type === 'auto' ? [p.part] : [])), [test])
  const sectionById = useMemo(() => Object.fromEntries(autoParts.map((a) => [a.section.id, a])), [autoParts])

  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [scores, setScores] = useState<Record<string, Diem | null>>({})
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({})
  const [open, setOpen] = useState<Record<string, string>>({})
  const [speaking, setSpeaking] = useState<Record<string, string>>({})
  const [active, setActive] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [restoredAt, setRestoredAt] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const phone = student?.studentPhone ?? ''

  // Đọc thông tin học viên + bài nháp từ localStorage một lần khi mở trang (cùng cách với Test 2/3).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const info = loadStudentInfo()
    if (info) setStudent(info)
    const d = loadDraft(code, info?.studentPhone ?? '')
    if (d && (Object.keys(d.exercises || {}).length || Object.keys(d.open || {}).length || Object.keys(d.speaking || {}).length)) {
      setScores(d.scores || {})
      setExerciseStates(d.exercises || {})
      setOpen(d.open || {})
      setSpeaking(d.speaking || {})
      setRestoredAt(d.savedAt)
    }
    setHydrated(true)
  }, [code])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return
    const t = setTimeout(() => {
      saveDraft(code, phone, {
        exercises: exerciseStates,
        scores,
        writingTask1: '',
        writingTask2: '',
        recordings: [],
        grammarScore: '',
        vocabScore: '',
        open,
        speaking,
      })
    }, 500)
    return () => clearTimeout(t)
  }, [hydrated, code, phone, exerciseStates, scores, open, speaking])

  const hasWork =
    Object.values(scores).some(Boolean) ||
    Object.values(exerciseStates).some((ex) => Object.keys(ex.answers ?? {}).length > 0) ||
    Object.values(open).some((v) => v.trim()) ||
    Object.values(speaking).some(Boolean)

  useEffect(() => {
    if (!hasWork || submitting) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasWork, submitting])

  function discardDraft() {
    clearDraft(code, phone)
    setScores({})
    setExerciseStates({})
    setOpen({})
    setSpeaking({})
    setRestoredAt(0)
  }

  // ---- điểm theo mục + nhóm câu
  function payload(): XepLopPayload {
    const categories: XepLopPayload['categories'] = {}
    for (const a of autoParts) {
      const sc = scores[a.section.id]
      const total = a.section.totalQuestions
      const prev = categories[a.category] ?? { score: 0, total: 0 }
      categories[a.category] = { score: prev.score + (sc?.score ?? 0), total: prev.total + total }
    }
    const groups: Record<string, Diem> = {}
    const all: Record<number, { ans: string; key: string[] }> = {}
    for (const a of autoParts) {
      const key = answerKey(a.section)
      const ans = exerciseStates[a.section.id]?.answers ?? {}
      for (const n of Object.keys(key)) all[+n] = { ans: ans[+n] ?? '', key: key[+n] }
    }
    for (const [g, nums] of Object.entries(GROUPS[code] ?? {})) {
      groups[g] = {
        score: nums.filter((n) => all[n] && all[n].ans && isAnswerCorrect(all[n].ans, all[n].key)).length,
        total: nums.length,
      }
    }
    const chuaLam = autoParts.filter((a) => !scores[a.section.id]).length
    return { code, categories, groups, chuaLam }
  }

  function openText(): string {
    const out: string[] = []
    for (const p of test.parts) {
      if (p.type !== 'open') continue
      const t = p.task
      out.push(`[${t.title}]`)
      if (t.kind === 'long') {
        const v = open[`${t.id}:${t.items[0].id}`] ?? ''
        out.push(`${v.trim() || '(bỏ trống)'}  — ${wordCount(v)} từ`)
      } else {
        for (const it of t.items) {
          const v = (open[`${t.id}:${it.id}`] ?? '').trim()
          out.push(`${it.id}. ${it.prompt ? `${it.prompt} → ` : ''}${v || '(bỏ trống)'}`)
        }
      }
    }
    return out.join('\n')
  }

  const missing: string[] = []
  for (const a of autoParts) if (!scores[a.section.id]) missing.push(a.section.label)
  for (const p of test.parts) {
    if (p.type === 'open' && !p.task.items.some((it) => (open[`${p.task.id}:${it.id}`] ?? '').trim())) missing.push(p.task.title)
  }
  for (const s of test.speaking) if (!speaking[s.id]) missing.push(`Nói câu ${s.id}`)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (missing.length > 0) {
      const ok = window.confirm(
        `Bạn chưa làm: ${missing.join(', ')}.\n\nVẫn nộp phần đã làm cho thầy cô? Thầy cô nhận được đúng những gì bạn đã làm.`
      )
      if (!ok) return
    }
    setError('')
    setSubmitting(true)
    const p = payload()
    const fmt = (d?: Diem) => (d ? `${d.score}/${d.total}` : '')
    try {
      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student?.studentName || '',
          studentPhone: student?.studentPhone || '',
          testLevel: code,
          testTypeLabel: test.sheetLabel,
          grammarScore: fmt(p.categories['ngu-phap']),
          vocabScore: fmt(p.categories['tu-vung']),
          readingScore: fmt(p.categories.doc),
          listeningScore: fmt(p.categories.nghe),
          writingTask2: openText(),
          recordingUrl: test.speaking
            .filter((s) => speaking[s.id])
            .map((s) => `Câu ${s.id}: ${speaking[s.id]}`)
            .join('\n'),
          xepLop: p,
          missingParts: missing,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      clearDraft(code, phone)
      sessionStorage.setItem('testResult', JSON.stringify(data))
      router.push('/result')
    } catch {
      setError('Lỗi khi nộp bài. Bài làm vẫn còn trên máy, bạn bấm Nộp lại sau ít phút nhé.')
      setSubmitting(false)
    }
  }

  const activeIdx = active ? autoParts.findIndex((a) => a.section.id === active) : -1
  const next = activeIdx >= 0 && activeIdx < autoParts.length - 1 ? autoParts[activeIdx + 1].section : null
  const fileStem = `xeplop${code}_${(phone || 'khach').replace(/\D/g, '') || 'khach'}`

  // Hàm vẽ (không phải component lồng) để ô viết không bị dựng lại mỗi lần gõ, mất con trỏ.
  function renderOpen(task: OpenTask) {
    if (task.kind === 'long') {
      const k = `${task.id}:${task.items[0].id}`
      const v = open[k] ?? ''
      const wc = wordCount(v)
      const min = task.minWords ?? 0
      return (
        <div>
          <label htmlFor={k} className="block text-sm font-medium text-gray-700 mb-1">
            {task.title}
            {min > 0 && <span className="text-gray-400 font-normal"> (ít nhất {min} từ)</span>}
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-700">
            <p className="italic">{task.instruction}</p>
            {task.bullets && task.bullets.length > 0 && (
              <ul className="list-disc pl-5 mt-1 not-italic">
                {task.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
          <textarea
            id={k}
            value={v}
            onChange={(e) => setOpen((o) => ({ ...o, [k]: e.target.value }))}
            rows={min >= 200 ? 14 : 7}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="sentences"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className={`text-right text-xs mt-1 ${min && wc >= min ? 'text-green-600' : 'text-gray-500'}`} aria-live="polite">
            {wc} từ{min ? (wc >= min ? ' ✓' : ` (cần thêm ${min - wc} từ)`) : ''}
            {task.maxWords && wc > task.maxWords ? ` · đã quá ${task.maxWords} từ` : ''}
          </p>
        </div>
      )
    }
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">{task.title}</p>
        <p className="text-sm text-gray-600 mb-2">{task.instruction}</p>
        {task.audioSrc && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">
              <HeadphonesIcon className="w-4 h-4 inline-block align-[-2px] mr-1" />
              File nghe của phần này (bấm phát một lần):
            </p>
            <audio controls src={task.audioSrc} className="w-full" preload="none" />
          </div>
        )}
        <div className="space-y-3">
          {task.items.map((it) => {
            const k = `${task.id}:${it.id}`
            return (
              <div key={k}>
                <label htmlFor={k} className="block text-sm text-gray-800 mb-1">
                  <span className="font-semibold mr-1">{it.id}.</span>
                  {it.prompt || <span className="text-gray-500">Câu chép chính tả</span>}
                  {it.hint && <span className="text-gray-500"> ({it.hint})</span>}
                </label>
                <textarea
                  id={k}
                  value={open[k] ?? ''}
                  onChange={(e) => setOpen((o) => ({ ...o, [k]: e.target.value }))}
                  rows={2}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (hydrated && !student) {
    return (
      <main className="min-h-screen px-4 py-12" style={{ background: 'var(--off-white)' }}>
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <h1 className="font-serif font-bold text-xl mb-2" style={{ color: 'var(--navy)' }}>{test.title}</h1>
          <p className="text-sm text-gray-600 mb-4">Bạn nhập họ tên và số điện thoại trước để thầy cô nhận đúng bài của bạn.</p>
          <a href="/get-test" className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl text-white font-semibold"
             style={{ background: 'var(--teal)' }}>
            Nhập thông tin để làm bài
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: 'var(--off-white)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold font-sans px-3 py-1 rounded-full mb-3"
                style={{ background: 'var(--mint)', color: 'var(--navy)' }}>
            Bài kiểm tra xếp lớp · {test.timeLabel}
          </span>
          <h1 className="font-serif font-bold text-2xl mb-2" style={{ color: 'var(--navy)' }}>{test.title}</h1>
          {student && (
            <p className="text-gray-600 text-sm">
              Xin chào <strong>{student.studentName}</strong>!
            </p>
          )}
        </div>

        {restoredAt > 0 && <DraftRestoredBanner savedAt={restoredAt} onDiscard={discardDraft} />}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">Trước khi làm bài</h2>
          <ul className="text-sm text-yellow-900 space-y-1.5 list-disc pl-5">
            {test.intro.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>Phần Nghe, Đọc, trắc nghiệm: bấm vào từng thẻ, làm xong bấm &quot;Hoàn thành&quot;. Phần viết và ghi âm làm ngay trên trang này.</li>
          </ul>
        </div>

        <div className="space-y-3 mb-8">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Phần máy chấm</h2>
          {autoParts.map(({ section, category }) => {
            const r = scores[section.id]
            const Icon = ICON[category]
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className="w-full min-h-[56px] flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-teal-400 rounded-xl p-4 transition-colors text-left"
              >
                <Icon className="w-6 h-6 shrink-0" style={{ color: 'var(--teal)' }} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {section.label} <span className="text-gray-500 font-normal text-xs">— {section.timeLabel}</span>
                  </h3>
                  <p className="text-gray-500 text-xs">{r ? `Đã làm: ${r.score}/${r.total} câu đúng` : 'Chưa làm'}</p>
                </div>
                <span className="text-sm font-medium shrink-0" style={{ color: 'var(--teal)' }}>
                  {r ? 'Xem lại →' : 'Bắt đầu →'}
                </span>
              </button>
            )
          })}
        </div>

        {active && sectionById[active] && (
          <ReadingListeningExercise
            key={active}
            section={sectionById[active].section}
            nextSection={next ? { id: next.id, label: next.label } : null}
            onComplete={(score, total) => setScores((s) => ({ ...s, [active]: { score, total } }))}
            onGoToNext={(id) => setActive(id)}
            onClose={() => setActive(null)}
            initialState={exerciseStates[active] ?? null}
            onStateChange={(st) => setExerciseStates((s) => ({ ...s, [active]: st }))}
          />
        )}

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-8">
          {test.parts.some((p) => p.type === 'open') && (
            <section className="space-y-6">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <PencilSquareIcon className="w-5 h-5" style={{ color: 'var(--teal)' }} /> Phần viết (thầy cô chấm)
              </h2>
              {test.parts.map((p) => (p.type === 'open' ? <div key={p.task.id}>{renderOpen(p.task)}</div> : null))}
            </section>
          )}

          {test.speaking.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <MicIcon className="w-5 h-5" style={{ color: 'var(--teal)' }} /> Phần Nói (ghi âm)
              </h2>
              <p className="text-sm text-gray-600">
                Bấm &quot;Bắt đầu ghi âm&quot;, nói bằng tiếng Anh, xong bấm &quot;Dừng&quot;. Bản ghi tự gửi cho thầy cô; muốn nói lại thì bấm &quot;Ghi lại&quot;.
                Không đọc bài viết sẵn.
              </p>
              {test.speaking.map((s) => (
                <SpeakingRecorder
                  key={s.id}
                  questionId={s.id}
                  label={`Câu ${s.id}`}
                  prompt={s.prompt}
                  note={s.note}
                  cueCard={s.cueCard}
                  maxSeconds={s.maxSeconds}
                  fileStem={fileStem}
                  value={speaking[s.id] ?? ''}
                  onChange={(url) => setSpeaking((x) => ({ ...x, [s.id]: url }))}
                />
              ))}
            </section>
          )}

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={submitting || !hasWork}
              className="w-full min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              {submitting ? 'Đang nộp bài...' : missing.length > 0 ? 'Nộp phần đã làm cho thầy cô' : 'Nộp bài cho thầy cô'}
            </button>
            {missing.length > 0 && hasWork && (
              <p className="text-center text-xs font-medium mt-2" style={{ color: 'var(--navy)' }}>
                <WarningIcon className="w-4 h-4 inline-block align-[-2px] mr-1" />
                Bạn chưa làm: {missing.join(', ')}. Vẫn nộp được phần đã làm nếu cần.
              </p>
            )}
            <p className="text-center text-gray-500 text-xs mt-2">
              Bài làm được tự lưu trên máy này. Đóng trang hay mất điện xong mở lại vẫn thấy nguyên bài đang làm dở.
            </p>
          </div>
        </form>
        <PromiseResubmit raised={!!active} />
      </div>
    </main>
  )
}
