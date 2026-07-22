import { NextRequest, NextResponse } from 'next/server'
import { createReservation } from '@/lib/db'
import { notifyOwner } from '@/lib/notify'
import { GIFT_OPTIONS } from '@/lib/types'

// 몰입 선물권 신청 접수. 금액은 서버에서 옵션 키로 결정한다.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, giftKey, toName, message } = body ?? {}

  const option = GIFT_OPTIONS.find((o) => o.key === giftKey)
  if (!name || !phone || !option) {
    return NextResponse.json(
      { error: '이름·연락처·선물 종류는 필수입니다.' },
      { status: 400 }
    )
  }

  const orderId = `gift_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const today = new Date().toISOString().split('T')[0]

  try {
    const reservation = await createReservation({
      id: orderId,
      name,
      phone,
      date: today,
      time: '00:00',
      duration: 0,
      amount: option.price,
      orderId,
      status: 'pending',
      method: 'transfer',
      kind: 'gift',
      wish:
        `${option.label}` +
        (toName ? ` → ${toName}님께` : '') +
        (message ? ` · "${message}"` : ''),
    })

    await notifyOwner(
      '🎁 몰입 선물권 신청! 입금 확인 필요',
      `${name}님이 선물권 신청\n` +
        `📞 ${phone}\n` +
        `🎁 ${option.label} · ${option.price.toLocaleString()}원\n` +
        (toName ? `받는 분: ${toName}\n` : '') +
        (message ? `메시지: "${message}"\n` : '') +
        `입금 확인 후 선물권 안내를 보내주세요`
    )

    return NextResponse.json({ reservation })
  } catch (e) {
    console.error('[gift] 저장 실패:', e)
    return NextResponse.json(
      { error: '신청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
