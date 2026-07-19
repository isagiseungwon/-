import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { deleteReservation } from '@/lib/db'

/** 관리자: 예약 삭제 (테스트 데이터/미입금 건 정리용) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { orderId } = await req.json()
  if (!orderId) {
    return NextResponse.json({ error: 'orderId가 필요합니다.' }, { status: 400 })
  }

  const removed = await deleteReservation(orderId)
  if (!removed) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
