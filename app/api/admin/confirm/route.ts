import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { updateReservation } from '@/lib/db'

/** 관리자: 계좌이체 입금 확인 → 예약 확정 처리 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { orderId } = await req.json()
  if (!orderId) {
    return NextResponse.json({ error: 'orderId가 필요합니다.' }, { status: 400 })
  }

  const updated = await updateReservation(orderId, {
    status: 'paid',
    paidAt: new Date().toISOString(),
  })
  if (!updated) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, reservation: updated })
}
