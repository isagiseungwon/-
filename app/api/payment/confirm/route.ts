import { NextRequest, NextResponse } from 'next/server'
import { getReservationByOrderId, updateReservation } from '@/lib/db'
import { notifyOwner } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const { paymentKey, orderId, amount } = await req.json()

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }

  const reservation = await getReservationByOrderId(orderId)
  if (!reservation) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (reservation.amount !== amount) {
    return NextResponse.json({ error: '금액이 일치하지 않습니다.' }, { status: 400 })
  }

  const secretKey = process.env.TOSS_SECRET_KEY ?? 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'
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

  const updated = await updateReservation(orderId, {
    paymentKey,
    status: 'paid',
  })

  if (updated) {
    await notifyOwner(
      '💰 결제 완료!',
      `${updated.name}님 결제 완료\n` +
        `📅 ${updated.date} ${updated.time} · ${updated.duration}시간 · ${updated.amount.toLocaleString()}원\n` +
        `📞 ${updated.phone}`
    )
  }

  return NextResponse.json({ success: true, reservation: updated })
}
