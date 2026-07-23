'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DAY_PASS, TIME_SLOTS, PayMethod } from '@/lib/types'

export default function BookingForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [method, setMethod] = useState<PayMethod>('transfer')
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !date || !time) return

    setLoading(true)
    const amount = DAY_PASS.price
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, date, time,
        duration: DAY_PASS.hours,
        amount, orderId, method,
      }),
    })

    if (!res.ok) {
      alert('예약 생성 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    const qs = `orderId=${orderId}&amount=${amount}&name=${encodeURIComponent(name)}&duration=${DAY_PASS.hours}`
    router.push(method === 'transfer' ? `/payment/transfer?${qs}` : `/payment?${qs}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 요금제 */}
      <div className="rounded-2xl p-6 border-2 border-[#3b2e21] bg-[#3b2e21] text-white text-center">
        <div className="text-sm font-medium mb-1 text-white/70">{DAY_PASS.label}</div>
        <div className="text-3xl font-semibold tracking-tight">
          {DAY_PASS.price.toLocaleString()}원
        </div>
        <div className="text-xs text-white/50 mt-2">
          입실 후 24시간 · 자유로운 외출과 출입
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
          className="w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">연락처</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          required
          className="w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">방문 날짜</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => { setDate(e.target.value); setTime('') }}
          required
          className="w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition"
        />
      </div>

      {date && (
        <div>
          <label className="block text-sm text-gray-500 mb-2">입실 예정 시간</label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`py-2 rounded-lg text-sm transition-all ${
                  time === slot
                    ? 'bg-[#3b2e21] text-white'
                    : 'bg-[#fdfaf4] border border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            입실 시간부터 24시간 동안 이용할 수 있어요
          </p>
        </div>
      )}

      {time && (
        <div className="rounded-xl bg-[#3b2e21]/[0.03] border border-[#3b2e21]/10 p-4 text-sm text-[#3b2e21]">
          <strong className="font-semibold">{date}</strong> {time} 입실 &nbsp;·&nbsp;{' '}
          {DAY_PASS.label} &nbsp;·&nbsp;{' '}
          <strong className="font-semibold">{DAY_PASS.price.toLocaleString()}원</strong>
        </div>
      )}

      {/* 결제 방법 선택 */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">결제 방법</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('transfer')}
            className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
              method === 'transfer'
                ? 'border-[#3b2e21] bg-[#3b2e21] text-white'
                : 'border-gray-200 bg-[#fdfaf4] text-gray-600 hover:border-gray-400'
            }`}
          >
            🏦 계좌이체
          </button>
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
              method === 'card'
                ? 'border-[#3b2e21] bg-[#3b2e21] text-white'
                : 'border-gray-200 bg-[#fdfaf4] text-gray-600 hover:border-gray-400'
            }`}
          >
            💳 카드결제
          </button>
        </div>
        {method === 'transfer' && (
          <p className="text-xs text-gray-400 mt-2">
            다음 화면에서 입금 계좌를 안내해 드려요
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!name || !phone || !date || !time || loading}
        className="w-full py-4 rounded-xl bg-[#3b2e21] text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4d3c2b] transition"
      >
        {loading
          ? '처리 중...'
          : method === 'transfer'
          ? `${DAY_PASS.price.toLocaleString()}원 계좌이체로 예약하기`
          : `${DAY_PASS.price.toLocaleString()}원 카드로 결제하기`}
      </button>
    </form>
  )
}
