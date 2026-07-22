'use client'

import { useState } from 'react'
import { BANK_INFO, GIFT_OPTIONS, GiftKey } from '@/lib/types'

// 몰입 선물권 신청 폼 (이벤트 핸들러 방식).
export default function GiftForm() {
  const [giftKey, setGiftKey] = useState<GiftKey>('day')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [toName, setToName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const selected = GIFT_OPTIONS.find((o) => o.key === giftKey)!
  const canSubmit = name.trim() && phone.trim() && !loading

  async function submit() {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          giftKey,
          toName: toName.trim(),
          message: message.trim(),
        }),
      })
      if (!res.ok) throw new Error('bad status')
      setDone(true)
    } catch {
      setError('신청 전송에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#e9c46a]/40 bg-[#e9c46a]/[0.08] p-8 text-center">
        <div className="text-3xl mb-4">🎁</div>
        <p className="text-[15px] leading-[1.9] text-[#1a1a2e] font-medium mb-2">
          선물권 신청이 접수되었어요.
        </p>
        <p className="text-sm leading-[1.9] text-gray-600 mb-6">
          입금이 확인되면 24시간 안에<br />
          받는 분께 전할 수 있는 <strong className="text-[#1a1a2e]">선물 안내</strong>를
          보내드립니다.
        </p>
        <div className="rounded-xl bg-white border border-gray-100 p-5 text-left text-sm text-gray-600">
          <p className="text-xs text-gray-400 mb-3">입금 계좌</p>
          <p className="text-[#1a1a2e] font-medium leading-relaxed">
            {BANK_INFO.bank} {BANK_INFO.account}
            <br />
            예금주 {BANK_INFO.holder}
          </p>
          <p className="mt-3 text-[#1a1a2e] font-semibold">
            {selected.label} · {selected.price.toLocaleString()}원
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 선물 종류 선택 */}
      <div className="space-y-3">
        {GIFT_OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setGiftKey(o.key)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all ${
              giftKey === o.key
                ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="text-[15px] font-medium">{o.label}</span>
            <span
              className={`text-sm font-semibold ${
                giftKey === o.key ? 'text-[#e9c46a]' : 'text-[#1a1a2e]'
              }`}
            >
              {o.price.toLocaleString()}원
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="보내는 분 이름"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="보내는 분 연락처"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>
      <input
        type="text"
        value={toName}
        onChange={(e) => setToName(e.target.value)}
        placeholder="받는 분 이름 (선택)"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="함께 전할 한 줄 메시지 (선택)"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
      />

      {error && <p className="text-sm text-[#e76f51]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl bg-[#1a1a2e] text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d2d4e] transition"
      >
        {loading
          ? '접수 중...'
          : `${selected.price.toLocaleString()}원 선물하기`}
      </button>
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        입금 확인 후, 받는 분께 전할 선물 안내를 보내드려요
      </p>
    </div>
  )
}
