'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PRICES, TIME_SLOTS } from '@/lib/types'

export default function BookingForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState<1 | 2>(1)
  const [reservedSlots, setReservedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!date) return
    fetch(`/api/reservations?date=${date}`)
      .then((r) => r.json())
      .then((d) => setReservedSlots(d.reservedSlots ?? []))
  }, [date])

  function isSlotAvailable(slot: string) {
    const hour = parseInt(slot.split(':')[0])
    for (let i = 0; i < duration; i++) {
      const check = `${String(hour + i).padStart(2, '0')}:00`
      if (reservedSlots.includes(check)) return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !date || !time) return

    setLoading(true)
    const amount = PRICES[duration]
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, date, time, duration, amount, orderId }),
    })

    if (!res.ok) {
      alert('예약 생성 중 오류가 발생했습니다.')
      setLoading(false)
      return
    }

    router.push(
      `/payment?orderId=${orderId}&amount=${amount}&name=${encodeURIComponent(name)}&duration=${duration}`
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 요금 선택 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setDuration(1)}
          className={`rounded-2xl p-5 border text-left transition-all ${
            duration === 1
              ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
              : 'border-gray-200 bg-white text-[#1a1a2e] hover:border-gray-400'
          }`}
        >
          <div className="text-base font-medium mb-1">1시간</div>
          <div className="text-2xl font-semibold tracking-tight">3,000원</div>
        </button>
        <button
          type="button"
          onClick={() => setDuration(2)}
          className={`rounded-2xl p-5 border text-left transition-all ${
            duration === 2
              ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
              : 'border-gray-200 bg-white text-[#1a1a2e] hover:border-gray-400'
          }`}
        >
          <div className="text-base font-medium mb-1">2시간</div>
          <div className="text-2xl font-semibold tracking-tight">5,000원</div>
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
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
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">날짜</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => { setDate(e.target.value); setTime('') }}
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>

      {date && (
        <div>
          <label className="block text-sm text-gray-500 mb-2">시간 선택</label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => {
              const available = isSlotAvailable(slot)
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={!available}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    time === slot
                      ? 'bg-[#1a1a2e] text-white'
                      : available
                      ? 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {time && (
        <div className="rounded-xl bg-[#1a1a2e]/[0.03] border border-[#1a1a2e]/10 p-4 text-sm text-[#1a1a2e]">
          <strong className="font-semibold">{date}</strong> {time} ~{' '}
          {String(parseInt(time) + duration).padStart(2, '0')}:00 &nbsp;·&nbsp;{' '}
          {duration}시간 &nbsp;·&nbsp;{' '}
          <strong className="font-semibold">{PRICES[duration].toLocaleString()}원</strong>
        </div>
      )}

      <button
        type="submit"
        disabled={!name || !phone || !date || !time || loading}
        className="w-full py-4 rounded-xl bg-[#1a1a2e] text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d2d4e] transition"
      >
        {loading ? '처리 중...' : `${PRICES[duration].toLocaleString()}원 결제하기`}
      </button>
    </form>
  )
}
