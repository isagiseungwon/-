'use client'

import { useState } from 'react'
import { BANK_INFO, MEMBERSHIP } from '@/lib/types'

// 월 멤버십 신청 폼 (이벤트 핸들러 방식).
export default function MembershipForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const canSubmit = name.trim() && phone.trim() && !loading

  async function submit() {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
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
      <div className="rounded-2xl border border-[#7f8f5a]/30 bg-[#7f8f5a]/[0.06] p-8 text-center">
        <div className="text-3xl mb-4">🪑</div>
        <p className="text-[15px] leading-[1.9] text-[#3b2e21] font-medium mb-2">
          멤버십 신청이 접수되었어요.
        </p>
        <p className="text-sm leading-[1.9] text-gray-600 mb-6">
          아래 계좌로 입금해 주시면,<br />
          확인 후 바로 시작 안내를 드립니다.
        </p>
        <div className="rounded-xl bg-[#fdfaf4] border border-gray-100 p-5 text-left text-sm text-gray-600">
          <p className="text-xs text-gray-400 mb-3">입금 계좌</p>
          <p className="text-[#3b2e21] font-medium leading-relaxed">
            {BANK_INFO.bank} {BANK_INFO.account}
            <br />
            예금주 {BANK_INFO.holder}
          </p>
          <p className="mt-3 text-[#3b2e21] font-semibold">
            {MEMBERSHIP.label} 월 {MEMBERSHIP.price.toLocaleString()}원
          </p>
          <p className="mt-1 text-xs text-gray-400">
            입금 확인일부터 한 달간 무제한 이용
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="연락처"
          className="w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition"
        />
      </div>
      {error && <p className="text-sm text-[#e76f51]">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl bg-[#3b2e21] text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4d3c2b] transition"
      >
        {loading
          ? '접수 중...'
          : `월 ${MEMBERSHIP.price.toLocaleString()}원으로 시작하기`}
      </button>
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        신청 후 계좌 안내 → 입금 확인 → 바로 시작
      </p>
    </div>
  )
}
