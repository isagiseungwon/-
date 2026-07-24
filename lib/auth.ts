import crypto from 'crypto'

/**
 * 관리자 인증 (서버 전용).
 * - 비밀번호는 서버 환경변수 ADMIN_PASSWORD 로만 확인 (브라우저에 노출 X)
 * - 로그인 성공 시 httpOnly 쿠키로 세션 토큰 발급
 * - 세션 토큰 = HMAC(비밀번호, SECRET) → 비번을 담지 않고 위조 불가
 *
 * ⚠️ 보안: 프로덕션(Vercel)에서는 반드시 아래 환경변수를 설정해야 한다.
 *   - ADMIN_PASSWORD         : 관리자 비밀번호 (길고 추측 어렵게)
 *   - ADMIN_SESSION_SECRET   : 세션 서명용 시크릿 (랜덤 32바이트 이상)
 * 설정하지 않으면 관리자 로그인은 '잠금'(fail-closed) 상태가 되어
 * 아무도 로그인할 수 없다. (코드에 박힌 기본값으로 열리는 사고 방지)
 */

const IS_PROD = process.env.NODE_ENV === 'production'

// 개발 환경에서만 편의를 위한 기본값 허용. 프로덕션에선 env 미설정 시 빈 값 → 잠금.
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || (IS_PROD ? '' : 'admin1234')

// 세션 서명 시크릿:
// - ADMIN_SESSION_SECRET 을 넣으면 그걸 사용 (권장)
// - 없으면 비밀번호에서 안전하게 유도 (비밀번호가 이미 비밀이므로 위조 불가,
//   코드에 박힌 공개 기본값을 쓰지 않는다)
// 따라서 프로덕션에서 필수 env 는 ADMIN_PASSWORD 하나면 충분하다.
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  (ADMIN_PASSWORD
    ? crypto.createHash('sha256').update(`molip-sess|${ADMIN_PASSWORD}`).digest('hex')
    : '')

// 인증이 설정되었는지 (프로덕션에서 비밀번호 누락 시 false → 모든 로그인/세션 거부)
export const AUTH_CONFIGURED = ADMIN_PASSWORD.length > 0 && SESSION_SECRET.length > 0

export const ADMIN_COOKIE = 'molip_admin'
export const COOKIE_SECURE = IS_PROD

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export function checkPassword(pw: unknown): boolean {
  if (!AUTH_CONFIGURED) return false // fail-closed
  if (typeof pw !== 'string' || pw.length === 0) return false
  return safeEqual(pw, ADMIN_PASSWORD)
}

export function sessionToken(): string {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(ADMIN_PASSWORD)
    .digest('hex')
}

export function isValidSession(token: string | undefined): boolean {
  if (!AUTH_CONFIGURED) return false // fail-closed
  if (!token) return false
  return safeEqual(token, sessionToken())
}
