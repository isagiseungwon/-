import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { getAllReservations, getCostSettings, saveCostSettings } from '@/lib/db'
import {
  DEFAULT_COST_ITEMS,
  computeMonthlyPnL,
  recentMonths,
  totalCost,
  toMonthKey,
} from '@/lib/finance'

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

// 고정비 + 선택한 달(기본 이번 달)의 손익 계산 결과
export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const month = req.nextUrl.searchParams.get('month') || toMonthKey(new Date())
  const [reservations, stored] = await Promise.all([
    getAllReservations(),
    getCostSettings(),
  ])

  const items = stored?.items?.length ? stored.items : DEFAULT_COST_ITEMS
  const fixedCost = totalCost(items)
  const pnl = computeMonthlyPnL(reservations, month, fixedCost)

  // 최근 6개월 추이 (매출/순익만 간단히)
  const trend = recentMonths(6).map((m) => {
    const p = computeMonthlyPnL(reservations, m, fixedCost)
    return { month: m, revenue: p.revenue, profit: p.profit }
  })

  return NextResponse.json({
    items,
    fixedCost,
    pnl,
    trend,
    months: recentMonths(12),
  })
}

// 고정비 저장
export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))

  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: 'items 배열이 필요합니다.' }, { status: 400 })
  }

  const items = body.items
    .slice(0, 20)
    .map((i: { label?: unknown; amount?: unknown }) => ({
      label: typeof i?.label === 'string' ? i.label.trim().slice(0, 40) : '',
      amount: Math.max(0, Math.round(Number(i?.amount) || 0)),
    }))
    .filter((i: { label: string }) => i.label.length > 0)

  try {
    await saveCostSettings({ items, updatedAt: Date.now() })
    return NextResponse.json({ success: true, fixedCost: totalCost(items) })
  } catch (e) {
    console.error('[finance] 저장 실패:', e)
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}
