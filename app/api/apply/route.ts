import { NextRequest, NextResponse } from 'next/server'
import { createReservation } from '@/lib/db'
import { notifyOwner } from '@/lib/notify'
import { PROGRAM } from '@/lib/program'

// 4주 프로그램 신청 접수.
// 공간 예약과 동일한 저장소(Reservation)를 재사용하되 kind='program' 으로 구분한다.
// 결제는 신청 후 개별 안내(계좌이체)이므로 여기서는 접수만 하고 pending 으로 남긴다.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, instagram, wish } = body ?? {}

  if (!name || !phone) {
    return NextResponse.json(
      { error: '이름과 연락처는 필수입니다.' },
      { status: 400 }
    )
  }

  const orderId = `apply_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const today = new Date().toISOString().split('T')[0]

  try {
    const reservation = await createReservation({
      id: orderId,
      name,
      phone,
      date: today, // 신청일
      time: '00:00', // 세션 요일·시간은 추후 협의
      duration: 0, // 공간 예약이 아니므로 좌석 계산에서 제외
      amount: PROGRAM.price,
      orderId,
      status: 'pending',
      method: 'transfer',
      kind: 'program',
      instagram: instagram || undefined,
      wish: wish || undefined,
    })

    await notifyOwner(
      `🌿 4주 프로그램 ${PROGRAM.cohort} 신청!`,
      `${name}님 신청\n` +
        `📞 ${phone}\n` +
        (instagram ? `📷 ${instagram}\n` : '') +
        (wish ? `✍️ "${wish}"\n` : '') +
        `💰 ${PROGRAM.price.toLocaleString()}원 (개별 안내 필요)`
    )

    return NextResponse.json({ reservation })
  } catch (e) {
    console.error('[apply] 저장 실패:', e)
    return NextResponse.json(
      { error: '신청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
