import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { getAllReservations } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const reservations = await getAllReservations()
  return NextResponse.json({ reservations })
}
