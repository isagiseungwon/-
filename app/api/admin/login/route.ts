import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, sessionToken, ADMIN_COOKIE, COOKIE_SECURE, AUTH_CONFIGURED } from '@/lib/auth'
import { rateLimit } from '@/lib/guard'

export async function POST(req: NextRequest) {
  // 무차별 대입 방지: IP당 10분에 10회
  const limited = await rateLimit(req, 'login', 10, 600)
  if (limited) return limited

  // 프로덕션에서 관리자 환경변수 미설정 시 로그인 자체를 잠금
  if (!AUTH_CONFIGURED) {
    return NextResponse.json(
      { error: '관리자 인증이 설정되지 않았습니다. (ADMIN_PASSWORD / ADMIN_SESSION_SECRET)' },
      { status: 503 }
    )
  }

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
    secure: COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12시간
  })
  return res
}
