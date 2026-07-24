'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BANK_INFO } from '@/lib/types'

function TransferContent() {
  const searchParams = useSearchParams()
  const amount = Number(searchParams.get('amount') ?? 0)
  const name = searchParams.get('name') ?? ''
  const duration = searchParams.get('duration') ?? '1'
  const [copied, setCopied] = useState(false)

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(BANK_INFO.account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 미지원 브라우저는 무시
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-4xl mb-4">🏦</div>
        <h1 className="serif text-xl font-semibold text-[#3b2e21] mb-2">
          입금 안내
        </h1>
        <p className="text-sm text-gray-500">
          아래 계좌로 입금해 주시면 예약이 확정됩니다
        </p>
      </div>

      {/* 계좌 카드 */}
      <div className="bg-[#fdfaf4] rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">은행</span>
            <span className="font-medium text-[#3b2e21]">{BANK_INFO.bank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">계좌번호</span>
            <span className="font-semibold text-[#3b2e21] text-base tracking-wide">
              {BANK_INFO.account}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">예금주</span>
            <span className="font-medium text-[#3b2e21]">{BANK_INFO.holder}</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="text-gray-500">입금 금액</span>
            <span className="font-bold text-lg text-[#3b2e21]">
              {amount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={copyAccount}
        className="w-full py-4 rounded-xl bg-[#3b2e21] text-white font-medium text-base hover:bg-[#4d3c2b] transition mb-5"
      >
        {copied ? '✅ 복사됐어요!' : '계좌번호 복사하기'}
      </button>

      {/* 안내 */}
      <div className="rounded-2xl bg-[#f3ece1] border border-gray-100 p-5 text-sm text-gray-600 space-y-2.5 mb-8">
        <p>
          ✍️ 입금자명은 꼭{' '}
          <strong className="text-[#3b2e21]">
            예약자 이름({name || '예약자명'})
          </strong>
          으로 보내주세요
        </p>
        <p>⏱ 입금 확인 후 예약이 확정돼요 (영업시간 내 보통 수 분)</p>
        <p>📱 확정되면 관리자가 확인 후 처리해 드려요</p>
        <p className="text-gray-400 text-xs pt-1">
          이용 예정: 몰입공간 {duration}시간 이용권 · {amount.toLocaleString()}원
        </p>
      </div>

      <div className="text-center">
        <a
          href="/"
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          처음으로 돌아가기
        </a>
      </div>
    </main>
  )
}

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">
          불러오는 중...
        </div>
      }
    >
      <TransferContent />
    </Suspense>
  )
}
