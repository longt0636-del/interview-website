'use client'

// Ghi âm một câu Nói ngay trên trang (bài xếp lớp 11/2026). Ghi xong tự gửi lên kho ghi âm riêng tư (cùng chỗ với Test 3),
// học viên nghe lại được và ghi lại nếu muốn. Máy không cho ghi âm thì vẫn chọn được tệp ghi âm có sẵn.
// Nguyên tắc giao diện (ui-ux-pro-max): nút ≥ 44px, có chữ chứ không chỉ biểu tượng, trạng thái báo bằng aria-live.
import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'asking' | 'recording' | 'uploading' | 'done' | 'error'

const EXT_BY_MIME: Array<[string, string]> = [
  ['audio/webm', '.webm'],
  ['audio/mp4', '.m4a'],
  ['audio/ogg', '.ogg'],
  ['audio/aac', '.aac'],
]

function pickMime(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  for (const m of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/aac']) {
    if (MediaRecorder.isTypeSupported?.(m)) return m
  }
  return ''
}

function extFor(mime: string): string {
  const base = mime.split(';')[0]
  return EXT_BY_MIME.find(([m]) => m === base)?.[1] ?? '.webm'
}

function putRecording(pathname: string, blob: Blob, contentType: string, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', `/api/upload-recording?path=${encodeURIComponent(pathname)}`)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let body: { pathname?: string; error?: string } = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        // báo lỗi chung bên dưới
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.pathname) resolve(body.pathname)
      else reject(new Error(body.error || `upload HTTP ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('network'))
    xhr.send(blob)
  })
}

function mmss(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

interface Props {
  questionId: string
  label: string
  prompt: string
  note?: string
  cueCard?: string[]
  maxSeconds: number
  /** Dùng đặt tên tệp: recordings/xeplop_<code>_<phone>_<câu>_<giờ>.<đuôi> */
  fileStem: string
  value: string // link đã gửi ('' nếu chưa)
  onChange: (url: string) => void
}

export function SpeakingRecorder({ questionId, label, prompt, note, cueCard, maxSeconds, fileStem, value, onChange }: Props) {
  const [phase, setPhase] = useState<Phase>(value ? 'done' : 'idle')
  const [seconds, setSeconds] = useState(0)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [localUrl, setLocalUrl] = useState('')
  const [canRetry, setCanRetry] = useState(false)
  const recRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  async function upload(blob: Blob, ext: string, contentType: string) {
    setPhase('uploading')
    setProgress(0)
    try {
      const path = `recordings/${fileStem}_${questionId}_${Date.now()}${ext}`
      const stored = await putRecording(path, blob, contentType, setProgress)
      onChange(`${window.location.origin}/api/recording?path=${encodeURIComponent(stored)}`)
      setPhase('done')
      setMessage('Đã gửi bản ghi âm cho thầy cô.')
    } catch {
      setPhase('error')
      setMessage('Chưa gửi được bản ghi âm (mạng yếu?). Bấm "Gửi lại" để thử lần nữa — bản ghi vẫn còn trên máy.')
    }
  }

  const pendingRef = useRef<{ blob: Blob; ext: string; type: string } | null>(null)

  async function start() {
    setMessage('')
    const mime = pickMime()
    if (!navigator.mediaDevices?.getUserMedia || !mime) {
      setPhase('error')
      setMessage('Trình duyệt này không ghi âm được. Em ghi bằng ứng dụng ghi âm của điện thoại rồi bấm "Chọn tệp ghi âm" bên dưới.')
      return
    }
    setPhase('asking')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const rec = new MediaRecorder(stream, { mimeType: mime })
      chunksRef.current = []
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (timerRef.current) clearInterval(timerRef.current)
        const type = mime.split(';')[0]
        const blob = new Blob(chunksRef.current, { type })
        if (localUrl) URL.revokeObjectURL(localUrl)
        setLocalUrl(URL.createObjectURL(blob))
        pendingRef.current = { blob, ext: extFor(mime), type }
        setCanRetry(true)
        void upload(blob, extFor(mime), type)
      }
      recRef.current = rec
      rec.start()
      setSeconds(0)
      setPhase('recording')
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= maxSeconds && recRef.current?.state === 'recording') recRef.current.stop()
          return s + 1
        })
      }, 1000)
    } catch {
      setPhase('error')
      setMessage('Máy chưa cho phép dùng micro. Em bấm "Cho phép" khi trình duyệt hỏi, hoặc chọn tệp ghi âm có sẵn bên dưới.')
    }
  }

  function stop() {
    if (recRef.current?.state === 'recording') recRef.current.stop()
  }

  function retryUpload() {
    const p = pendingRef.current
    if (p) void upload(p.blob, p.ext, p.type)
  }

  function onFile(file: File | undefined) {
    if (!file) return
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '.m4a'
    const type = file.type || 'application/octet-stream'
    if (localUrl) URL.revokeObjectURL(localUrl)
    setLocalUrl(URL.createObjectURL(file))
    pendingRef.current = { blob: file, ext, type }
    setCanRetry(true)
    void upload(file, ext, type)
  }

  const btn = 'inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg font-semibold text-sm transition-opacity'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
        {label}
      </p>
      <p className="text-base font-medium mb-1" style={{ color: 'var(--ink)' }}>
        {prompt}
      </p>
      {cueCard && cueCard.length > 0 && (
        <ul className="text-sm text-gray-600 mb-1 list-disc pl-5">
          {cueCard.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      {note && <p className="text-xs text-gray-500 mb-3">({note})</p>}

      <div className="flex flex-wrap items-center gap-2">
        {phase === 'recording' ? (
          <button type="button" onClick={stop} className={`${btn} text-white`} style={{ background: '#DC2626' }}>
            ■ Dừng ghi ({mmss(seconds)} / {mmss(maxSeconds)})
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={phase === 'asking' || phase === 'uploading'}
            className={`${btn} text-white disabled:opacity-50`}
            style={{ background: 'var(--teal)' }}
          >
            {phase === 'done' || phase === 'error' ? '● Ghi lại' : '● Bắt đầu ghi âm'}
          </button>
        )}
        {phase === 'error' && canRetry && (
          <button type="button" onClick={retryUpload} className={`${btn} border-2`} style={{ borderColor: 'var(--teal)', color: 'var(--navy)' }}>
            Gửi lại
          </button>
        )}
        <label className={`${btn} border border-gray-300 text-gray-700 cursor-pointer`}>
          Chọn tệp ghi âm
          <input type="file" accept="audio/*,.m4a,.amr,.3gp,.aac,.mp3,.wav,.ogg,.opus,.webm" className="sr-only"
                 onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>

      {localUrl && phase !== 'recording' && (
        <audio controls src={localUrl} className="w-full mt-3" aria-label={`Nghe lại câu ${label}`} />
      )}

      <p className="text-sm mt-2 min-h-[1.25rem]" aria-live="polite" role={phase === 'error' ? 'alert' : undefined}
         style={{ color: phase === 'error' ? '#B91C1C' : phase === 'done' ? 'var(--teal)' : '#6B7280' }}>
        {phase === 'asking' && 'Đang xin quyền dùng micro…'}
        {phase === 'recording' && 'Đang ghi âm… nói xong bấm Dừng.'}
        {phase === 'uploading' && `Đang gửi bản ghi âm… ${progress}%`}
        {(phase === 'done' || phase === 'error') && message}
        {phase === 'done' && !message && 'Đã gửi bản ghi âm.'}
      </p>
    </div>
  )
}
