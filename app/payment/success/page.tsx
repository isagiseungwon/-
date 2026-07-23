'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const paymentKey = searchParams.get('paymentKey') ?? ''
  const orderId = searchParams.get('orderId') ?? ''
  const amount = Number(searchParams.get('amount') ?? 0)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [reservation, setReservation] = useState<{
    name: string; date: string; time: string; duration: number
  } | null>(null)

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus('error')
      return
    }

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStatus('error')
        } else {
          setReservation(data.reservation)
          setStatus('success')
        }
      })
      .catch(() => setStatus('error'))
  }, [paymentKey, orderId, amount])

  if (status === 'loading') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-4xl mb-4 animate-pulse">💳</div>
        <p className="text-gray-500 text-sm">결제 확인 중...</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-[#3b2e21] mb-2">결제 확인 실패</h1>
        <p className="text-sm text-gray-500 mb-6">결제 처리 중 문제가 발생했습니다.</p>
        <a href="/" className="px-6 py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-medium">
          처음으로
        </a>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="text-5xl mb-5">✅</div>
      <h1 className="text-2xl font-bold text-[#3b2e21] mb-2">예약 완료!</h1>
      <p className="text-sm text-gray-500 mb-8">몰입공간 예약이 확정되었습니다.</p>

      {reservation && (
        <div className="bg-[#fdfaf4] rounded-2xl border border-gray-100 px-8 py-6 text-left max-w-sm w-full mb-8">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">이름</span>
              <span className="font-medium">{reservation.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">날짜</span>
              <span className="font-medium">{reservation.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">입실 시간</span>
              <span className="font-medium">{reservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">이용권</span>
              <span className="font-medium">{reservation.duration}시간 이용권</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-500">결제금액</span>
              <span className="font-bold text-[#3b2e21]">{amount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      )}

      <a href="/" className="px-6 py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-medium hover:bg-[#4d3c2b] transition">
        처음으로
      </a>

      <p className="text-xs text-gray-400 mt-8 leading-relaxed">
        이용 후 좋으셨다면,{' '}
        <a
          href="https://map.naver.com/p/search/%EB%AA%B0%EC%9E%85%2C%20%ED%9D%90%EB%A6%84%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%EB%82%98"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#03c75a] underline font-medium"
        >
          네이버 리뷰
        </a>
        로 첫 이야기를 남겨주세요 ⭐
      </p>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-gray-400">불러오는 중...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
