import { NextRequest, NextResponse } from 'next/server'
import { createReservation } from '@/lib/db'
import { notifyOwner } from '@/lib/notify'

// 몰입 테스트 결과 리포트 신청 (리드 수집).
// 예약과 같은 저장소를 재사용하되 kind='lead' 로 구분한다.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, contact, resultTitle, resultEmoji, envPct, peerPct } = body ?? {}

  if (!contact) {
    return NextResponse.json({ error: '연락처는 필수입니다.' }, { status: 400 })
  }

  const orderId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const today = new Date().toISOString().split('T')[0]
  const summary = resultTitle
    ? `${resultEmoji ?? ''} ${resultTitle} · 환경 ${envPct ?? '?'}% / 지속 ${peerPct ?? '?'}%`.trim()
    : '몰입 테스트 리드'

  try {
    const reservation = await createReservation({
      id: orderId,
      name: name || '이름 미기재',
      phone: contact,
      date: today,
      time: '00:00',
      duration: 0,
      amount: 0,
      orderId,
      status: 'pending',
      kind: 'lead',
      wish: summary,
    })

    await notifyOwner(
      '🧭 몰입 테스트 리드 도착!',
      `${reservation.name}\n` +
        `📞 ${contact}\n` +
        `${summary}\n` +
        `→ 결과 리포트 + 맞춤 처방 DM/문자 보내주세요`
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[lead] 저장 실패:', e)
    return NextResponse.json(
      { error: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
