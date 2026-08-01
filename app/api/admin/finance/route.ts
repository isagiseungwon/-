import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import {
  getAllReservations,
  getCostSettings,
  saveCostSettings,
  listEntries,
  saveEntry,
  deleteEntry,
} from '@/lib/db'
import {
  DEFAULT_COST_ITEMS,
  DEFAULT_TAX_SETTINGS,
  computeMonthlyPnL,
  estimateTax,
  recentMonths,
  totalCost,
  toMonthKey,
  TaxSettings,
} from '@/lib/finance'

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const month = req.nextUrl.searchParams.get('month') || toMonthKey(new Date())
  const [reservations, stored, entries] = await Promise.all([
    getAllReservations(),
    getCostSettings(),
    listEntries(),
  ])

  const items = stored?.items?.length ? stored.items : DEFAULT_COST_ITEMS
  const fixedCost = totalCost(items)
  const tax: TaxSettings = {
    taxType: stored?.taxType ?? DEFAULT_TAX_SETTINGS.taxType,
    vatRate: stored?.vatRate ?? DEFAULT_TAX_SETTINGS.vatRate,
  }

  const pnl = computeMonthlyPnL(reservations, entries, month, fixedCost)

  // 최근 12개월 중 매출 있는 달만 모아 연 환산
  const months12 = recentMonths(12)
  const perMonth = months12.map((m) =>
    computeMonthlyPnL(reservations, entries, m, fixedCost)
  )
  const active = perMonth.filter((p) => p.revenue > 0)
  const monthsCounted = active.length
  const yearRevenue = monthsCounted
    ? Math.round((active.reduce((s, p) => s + p.revenue, 0) / monthsCounted) * 12)
    : 0
  const yearProfit = monthsCounted
    ? Math.round((active.reduce((s, p) => s + p.profit, 0) / monthsCounted) * 12)
    : 0

  const taxEstimate = estimateTax(yearRevenue, yearProfit, monthsCounted, tax)

  const trend = recentMonths(6).map((m) => {
    const p = perMonth.find((x) => x.month === m)!
    return { month: m, revenue: p.revenue, profit: p.profit }
  })

  return NextResponse.json({
    items,
    fixedCost,
    tax,
    pnl,
    taxEstimate,
    trend,
    months: months12,
    entries: entries.filter((e) => e.date.slice(0, 7) === month),
  })
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))

  // ── 거래 추가 ──
  if (body?.action === 'addEntry') {
    const amount = Math.max(0, Math.round(Number(body?.amount) || 0))
    const label = typeof body?.label === 'string' ? body.label.trim().slice(0, 40) : ''
    const date =
      typeof body?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
        ? body.date
        : new Date().toISOString().slice(0, 10)
    const type: 'income' | 'expense' = body?.type === 'expense' ? 'expense' : 'income'
    if (!label || amount <= 0) {
      return NextResponse.json({ error: '항목과 금액을 입력해주세요.' }, { status: 400 })
    }
    const entry = {
      id: `ent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date,
      type,
      label,
      amount,
      memo: typeof body?.memo === 'string' ? body.memo.trim().slice(0, 100) : '',
      createdAt: Date.now(),
    }
    try {
      await saveEntry(entry)
      return NextResponse.json({ entry })
    } catch (e) {
      console.error('[finance] 거래 저장 실패:', e)
      return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
    }
  }

  // ── 고정비 + 세금 설정 저장 ──
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

  const taxType: 'simple' | 'general' = body?.taxType === 'general' ? 'general' : 'simple'
  const vatRate = Math.min(100, Math.max(0, Math.round(Number(body?.vatRate) || 30)))

  try {
    await saveCostSettings({ items, updatedAt: Date.now(), taxType, vatRate })
    return NextResponse.json({ success: true, fixedCost: totalCost(items) })
  } catch (e) {
    console.error('[finance] 저장 실패:', e)
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 })
  const ok = await deleteEntry(id)
  return NextResponse.json({ success: ok })
}
