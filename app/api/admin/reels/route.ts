import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { listReels, saveReel, deleteReel } from '@/lib/db'
import { FORMULA_KEYS } from '@/lib/reels'

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

function clip(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const refs = await listReels()
  return NextResponse.json({ refs })
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))

  const why = clip(body?.why, 200)
  if (!why) {
    return NextResponse.json({ error: '"왜 먹혔나" 한 줄은 필수입니다.' }, { status: 400 })
  }

  const formula: string[] = Array.isArray(body?.formula)
    ? body.formula.filter((k: unknown): k is string =>
        typeof k === 'string' && (FORMULA_KEYS as string[]).includes(k)
      )
    : []

  const ref = {
    id: `reel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    url: clip(body?.url, 300),
    why,
    need: clip(body?.need, 200),
    formula,
    createdAt: Date.now(),
  }

  try {
    await saveReel(ref)
    return NextResponse.json({ ref })
  } catch (e) {
    console.error('[reels] 저장 실패:', e)
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 })
  const ok = await deleteReel(id)
  return NextResponse.json({ success: ok })
}
