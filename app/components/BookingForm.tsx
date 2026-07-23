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
      <div className="rounded-2xl p-6 border border-[#e9c46a]/40 bg-[#332619] text-[#f0e7d7] text-center">
        <div className="text-sm font-medium mb-1 text-[#e9c46a]">{DAY_PASS.label}</div>
        <div className="text-3xl font-semibold tracking-tight">
          {DAY_PASS.price.toLocaleString()}원
        </div>
        <div className="text-xs text-[#aa9a83] mt-2">
          입실 후 24시간 · 자유로운 외출과 출입
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#aa9a83] mb-1.5">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
          className="w-full rounded-xl border border-white/15 bg-[#332619] px-4 py-3 text-sm focus:outline-none focus:border-[#e9c46a]/55 transition"
        />
      </div>

      <div>
        <label className="block text-sm text-[#aa9a83] mb-1.5">연락처</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
          required
          className="w-full rounded-xl border border-white/15 bg-[#332619] px-4 py-3 text-sm focus:outline-none focus:border-[#e9c46a]/55 transition"
        />
      </div>

      <div>
        <label className="block text-sm text-[#aa9a83] mb-1.5">방문 날짜</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => { setDate(e.target.value); setTime('') }}
          required
          className="w-full rounded-xl border border-white/15 bg-[#332619] px-4 py-3 text-sm focus:outline-none focus:border-[#e9c46a]/55 transition"
        />
      </div>

      {date && (
        <div>
          <label className="block text-sm text-[#aa9a83] mb-2">입실 예정 시간</label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`py-2 rounded-lg text-sm transition-all ${
                  time === slot
                    ? 'bg-[#e9c46a] text-[#241a10]'
                    : 'bg-[#332619] border border-white/15 text-[#e3d8c5] hover:border-white/30'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#8f7e69] mt-2">
            입실 시간부터 24시간 동안 이용할 수 있어요
          </p>
        </div>
      )}

      {time && (
        <div className="rounded-xl bg-[#e9c46a]/[0.03] border border-[#e9c46a]/10 p-4 text-sm text-[#f0e7d7]">
          <strong className="font-semibold">{date}</strong> {time} 입실 &nbsp;·&nbsp;{' '}
          {DAY_PASS.label} &nbsp;·&nbsp;{' '}
          <strong className="font-semibold">{DAY_PASS.price.toLocaleString()}원</strong>
        </div>
      )}

      {/* 결제 방법 선택 */}
      <div>
        <label className="block text-sm text-[#aa9a83] mb-2">결제 방법</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('transfer')}
            className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
              method === 'transfer'
                ? 'border-[#e9c46a]/55 bg-[#e9c46a] text-[#241a10]'
                : 'border-white/15 bg-[#332619] text-[#d0c3ad] hover:border-white/30'
            }`}
          >
            🏦 계좌이체
          </button>
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={`py-3.5 rounded-xl border text-sm font-medium transition-all ${
              method === 'card'
                ? 'border-[#e9c46a]/55 bg-[#e9c46a] text-[#241a10]'
                : 'border-white/15 bg-[#332619] text-[#d0c3ad] hover:border-white/30'
            }`}
          >
            💳 카드결제
          </button>
        </div>
        {method === 'transfer' && (
          <p className="text-xs text-[#8f7e69] mt-2">
            다음 화면에서 입금 계좌를 안내해 드려요
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!name || !phone || !date || !time || loading}
        className="w-full py-4 rounded-xl bg-[#e9c46a] text-[#241a10] font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#d9b45a] transition"
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
