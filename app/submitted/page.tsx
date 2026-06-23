'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SubmittedPage() {
  const [suggestedClass, setSuggestedClass] = useState('')

  useEffect(() => {
    const cls = sessionStorage.getItem('submittedClass') || ''
    setSuggestedClass(cls)
    sessionStorage.removeItem('submittedClass')
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">Thầy Long đã nhận được bài của bạn!</h1>
        <p className="text-gray-500 mb-6">
          Trong vòng <strong>24 giờ</strong>, thầy sẽ liên hệ qua số điện thoại để xem xét kết quả
          và sắp xếp buổi học thử phù hợp.
        </p>

        {/* Suggested Class */}
        {suggestedClass && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-left">
            <h2 className="font-semibold text-green-800 mb-1 text-sm uppercase tracking-wide">Lớp phù hợp với bạn</h2>
            <p className="text-green-900 text-lg font-bold">{suggestedClass}</p>
            <p className="text-green-700 text-xs mt-2">
              Dựa trên kết quả bài test và lộ trình học của bạn. Thầy Long sẽ xác nhận sau khi xem xét bài làm.
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 text-left">
          <h2 className="font-semibold text-blue-800 mb-3">Bước tiếp theo</h2>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex gap-2">
              <span className="shrink-0">📞</span>
              <span>Thầy Long sẽ gọi điện hoặc nhắn Zalo để tư vấn kết quả.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">📅</span>
              <span>Sắp xếp <strong>2 buổi học thử</strong> (phí cam kết 50.000đ, hoàn lại 40.000đ sau học thử).</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">🎯</span>
              <span>Nhận lộ trình học cá nhân hóa phù hợp với mục tiêu và trình độ.</span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    </main>
  )
}
