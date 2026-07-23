import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { getAllReservations, getAllNotes, setCustomerNote } from '@/lib/db'
import { buildCustomers, buildActionItems } from '@/lib/crm'

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

// 고객 목록 + 오늘 할 일 집계
export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const [reservations, notes] = await Promise.all([getAllReservations(), getAllNotes()])
  const customers = buildCustomers(reservations, notes)
  const actions = buildActionItems(customers)
  const stats = {
    total: customers.length,
    members: customers.filter((c) => c.stage === 'member').length,
    regulars: customers.filter((c) => c.stage === 'regular').length,
    leads: customers.filter((c) => c.stage === 'lead').length,
    dormant: customers.filter((c) => c.stage === 'dormant').length,
    revenue: customers.reduce((s, c) => s + c.totalSpent, 0),
  }
  return NextResponse.json({ customers, actions, stats })
}

// 고객 메모 저장
export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { phone, note } = await req.json()
  if (!phone) return NextResponse.json({ error: 'phone이 필요합니다.' }, { status: 400 })
  await setCustomerNote(phone, (note ?? '').slice(0, 500))
  return NextResponse.json({ success: true })
}
