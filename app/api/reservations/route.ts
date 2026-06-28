import { NextRequest, NextResponse } from 'next/server'
import { createReservation, getAllReservations, getReservedSlots } from '@/lib/db'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (date) {
    const reservedSlots = await getReservedSlots(date)
    return NextResponse.json({ reservedSlots })
  }

  const reservations = await getAllReservations()
  return NextResponse.json({ reservations })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, date, time, duration, amount, orderId } = body

  if (!name || !phone || !date || !time || !duration || !amount || !orderId) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  try {
    const reservation = await createReservation({
      id: orderId,
      name,
      phone,
      date,
      time,
      duration,
      amount,
      orderId,
      status: 'pending',
    })
    return NextResponse.json({ reservation })
  } catch (e) {
    console.error('[reservations] 저장 실패:', e)
    return NextResponse.json(
      { error: '예약 저장에 실패했습니다. 데이터베이스(KV) 연결을 확인해주세요.' },
      { status: 500 }
    )
  }
}
