import { NextRequest, NextResponse } from 'next/server'
import { createReservation, getAllReservations, getReservedSlots } from '@/lib/db'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (date) {
    const reservedSlots = getReservedSlots(date)
    return NextResponse.json({ reservedSlots })
  }

  const reservations = getAllReservations()
  return NextResponse.json({ reservations })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, date, time, duration, amount, orderId } = body

  if (!name || !phone || !date || !time || !duration || !amount || !orderId) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  const reservation = createReservation({
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
}
