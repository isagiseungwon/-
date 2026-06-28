import { NextRequest, NextResponse } from 'next/server'
import { getReservationByOrderId, updateReservation } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { paymentKey, orderId, amount } = await req.json()

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }

  const reservation = getReservationByOrderId(orderId)
  if (!reservation) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (reservation.amount !== amount) {
    return NextResponse.json({ error: '금액이 일치하지 않습니다.' }, { status: 400 })
  }

  const secretKey = process.env.TOSS_SECRET_KEY ?? 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R'
  const encoded = Buffer.from(`${secretKey}:`).toString('base64')

  const tossRes = await fetch(`https://api.tosspayments.com/v1/payments/confirm`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  const tossData = await tossRes.json()

  if (!tossRes.ok) {
    return NextResponse.json({ error: tossData.message ?? '결제 승인 실패' }, { status: 400 })
  }

  const updated = updateReservation(orderId, {
    paymentKey,
    status: 'paid',
  })

  return NextResponse.json({ success: true, reservation: updated })
}
