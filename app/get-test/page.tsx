'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GetTestPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/find-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Lỗi không xác định.')
        return
      }

      // Save to sessionStorage for use in test pages
      sessionStorage.setItem('studentInfo', JSON.stringify(data))
      router.push(`/test/${data.testLevel}`)
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">LongIELTS</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nhận bài kiểm tra trình độ</h1>
          <p className="text-gray-500 text-sm">
            Nhập thông tin bạn đã dùng khi điền form khảo sát. Hệ thống sẽ tự tìm và giao bài test phù hợp.
          </p>
        </div>

        {/* Dev mode banner */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4 text-xs text-amber-800 font-mono">
            <strong>⚙️ DEV MODE:</strong> Google Sheet bị bỏ qua. Nhập bất kỳ tên/SĐT để test.<br />
            Thêm <code>test2</code> hoặc <code>test3</code> vào tên để thử Test 2/3.
          </div>
        )}

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <strong>Lưu ý:</strong> Bạn cần điền form khảo sát trước khi nhận bài test.{' '}
          <a
            href="https://docs.google.com/forms/d/1sZbzR4G_j-YYpKKBcQ5bNwHhfQEH9a0k9GaJW4FCtjk/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            Điền form tại đây
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0912345678"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!name && !phone)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Đang tìm kiếm...' : 'Nhận bài test của tôi'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Gặp vấn đề? Liên hệ thầy Long qua Facebook hoặc Zalo.
        </p>
      </div>
    </main>
  )
}
