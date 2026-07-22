import { NextRequest, NextResponse } from 'next/server'
import { createReservation } from '@/lib/db'
import { notifyOwner } from '@/lib/notify'
import { MEMBERSHIP } from '@/lib/types'

// 월 몰입 멤버십 신청 접수. 금액은 서버에서 고정한다.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone } = body ?? {}

  if (!name || !phone) {
    return NextResponse.json(
      { error: '이름과 연락처는 필수입니다.' },
      { status: 400 }
    )
  }

  const orderId = `member_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const today = new Date().toISOString().split('T')[0]

  try {
    const reservation = await createReservation({
      id: orderId,
      name,
      phone,
      date: today,
      time: '00:00',
      duration: 0,
      amount: MEMBERSHIP.price,
      orderId,
      status: 'pending',
      method: 'transfer',
      kind: 'membership',
    })

    await notifyOwner(
      '💳 몰입 멤버십 신청! 입금 확인 필요',
      `${name}님 멤버십 신청 (월 무제한)\n` +
        `📞 ${phone}\n` +
        `💰 ${MEMBERSHIP.price.toLocaleString()}원/월\n` +
        `입금 확인되면 관리자에서 확정해주세요`
    )

    return NextResponse.json({ reservation })
  } catch (e) {
    console.error('[membership] 저장 실패:', e)
    return NextResponse.json(
      { error: '신청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
