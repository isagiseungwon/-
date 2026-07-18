import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, sessionToken, ADMIN_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  let body: { password?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    // ignore
  }

  if (!checkPassword(body.password)) {
    return NextResponse.json(
      { error: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12시간
  })
  return res
}
