'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function FailContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="text-5xl mb-5">😔</div>
      <h1 className="text-2xl font-bold text-[#3b2e21] mb-2">결제 실패</h1>
      <p className="text-sm text-gray-500 mb-8">{message}</p>
      <a
        href="/"
        className="px-6 py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-medium hover:bg-[#4d3c2b] transition"
      >
        다시 예약하기
      </a>
    </main>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-gray-400">불러오는 중...</div>}>
      <FailContent />
    </Suspense>
  )
}
