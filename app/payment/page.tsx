'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PaymentWidget() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') ?? ''
  const amount = Number(searchParams.get('amount') ?? 0)
  const name = searchParams.get('name') ?? ''
  const duration = searchParams.get('duration') ?? '1'

  const widgetRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [widgetInstance, setWidgetInstance] = useState<unknown>(null)

  useEffect(() => {
    if (!orderId || !amount) return

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.async = true
    script.onload = async () => {
      // @ts-expect-error toss global
      const toss = window.TossPayments(clientKey)
      const widget = toss.widgets({ customerKey: `customer_${orderId}` })

      await widget.setAmount({ currency: 'KRW', value: amount })
      await widget.renderPaymentMethods({
        selector: '#toss-payment-methods',
        variantKey: 'DEFAULT',
      })
      await widget.renderAgreement({
        selector: '#toss-agreement',
        variantKey: 'AGREEMENT',
      })

      setWidgetInstance(widget)
      setReady(true)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [orderId, amount])

  async function handlePay() {
    if (!widgetInstance) return
    try {
      // @ts-expect-error toss widget
      await widgetInstance.requestPayment({
        orderId,
        orderName: `몰입공간 ${duration}시간 이용권`,
        customerName: name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← 뒤로</a>
        <h1 className="text-xl font-bold mt-4 text-[#1a1a2e]">결제하기</h1>
        <p className="text-sm text-gray-500 mt-1">
          몰입공간 {duration}시간 이용권 · <strong>{amount.toLocaleString()}원</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div id="toss-payment-methods" ref={widgetRef} />
        <div id="toss-agreement" className="mt-4" />
      </div>

      <button
        onClick={handlePay}
        disabled={!ready}
        className="w-full py-4 rounded-xl bg-[#1a1a2e] text-white font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d2d4e] transition"
      >
        {ready ? `${amount.toLocaleString()}원 결제하기` : '결제 수단 불러오는 중...'}
      </button>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-gray-400">불러오는 중...</div>}>
      <PaymentWidget />
    </Suspense>
  )
}
