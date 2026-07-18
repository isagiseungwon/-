import { NextRequest, NextResponse } from 'next/server'
import { createReservation, getReservedSlots } from '@/lib/db'

// 공개 엔드포인트: 특정 날짜의 "예약된 시간대"만 반환한다.
// 개인정보(이름·연락처 등)는 절대 반환하지 않으며, 전체 목록은
// 인증이 필요한 /api/admin/reservations 로 분리했다.
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'date 파라미터가 필요합니다.' }, { status: 400 })
  }

  const reservedSlots = await getReservedSlots(date)
  return NextResponse.json({ reservedSlots })
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
