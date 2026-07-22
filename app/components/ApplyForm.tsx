'use client'

import { useEffect, useState } from 'react'
import { BANK_INFO } from '@/lib/types'
import { PROGRAM } from '@/lib/program'

// 4주 프로그램 신청 폼.
// 스펙에 따라 HTML <form> 제출 대신 버튼 onClick 이벤트 핸들러로 처리한다.
export default function ApplyForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [wish, setWish] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // 몰입 테스트 결과에서 넘어온 경우(?type=유형) 유형을 미리 채워둔다
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type')
    if (t) setWish((prev) => prev || `${t} 유형 · `)
  }, [])

  const canSubmit = name.trim() && phone.trim() && !loading

  async function submit() {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          instagram: instagram.trim(),
          wish: wish.trim(),
        }),
      })
      if (!res.ok) throw new Error('bad status')
      setDone(true)
    } catch {
      setError('신청 전송에 실패했어요. 잠시 후 다시 시도하거나 인스타 DM으로 문의해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#2a9d8f]/30 bg-[#2a9d8f]/[0.06] p-8 text-center">
        <div className="text-3xl mb-4">🪑</div>
        <p className="text-[15px] leading-[1.9] text-[#1a1a2e] font-medium mb-2">
          신청이 접수되었어요.
        </p>
        <p className="text-sm leading-[1.9] text-gray-600 mb-6">
          24시간 안에 DM 또는 문자로 안내드립니다.
        </p>
        <div className="rounded-xl bg-white border border-gray-100 p-5 text-left text-sm text-gray-600">
          <p className="text-xs text-gray-400 mb-3">
            참가비 입금 계좌 (안내받으신 뒤 입금해 주세요)
          </p>
          <p className="text-[#1a1a2e] font-medium leading-relaxed">
            {BANK_INFO.bank} {BANK_INFO.account}
            <br />
            예금주 {BANK_INFO.holder}
          </p>
          <p className="mt-3 text-[#1a1a2e] font-semibold">
            {PROGRAM.cohort} 한정 {PROGRAM.price.toLocaleString()}원
          </p>
          <p className="mt-1 text-xs text-gray-400">
            입금 순서대로 자리가 확정됩니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-gray-500 mb-1.5">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
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
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">
          인스타그램 아이디 <span className="text-gray-300">(선택)</span>
        </label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@your_id"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5">
          이 프로그램에서 이루고 싶은 것 한 줄
        </label>
        <input
          type="text"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="예: 미루던 사이드 프로젝트를 4주 안에 시작하기"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] transition"
        />
      </div>

      {error && (
        <p className="text-sm text-[#e76f51] leading-relaxed">{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl bg-[#1a1a2e] text-white font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d2d4e] transition"
      >
        {loading ? '접수 중...' : `${PROGRAM.cohort} 신청하기`}
      </button>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        신청 후 참가비 입금 방법을 개별 안내해 드려요.
        <br />
        결제가 확인되면 자리가 확정됩니다.
      </p>
    </div>
  )
}
