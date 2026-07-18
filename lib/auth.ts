import crypto from 'crypto'

/**
 * 관리자 인증 (서버 전용).
 * - 비밀번호는 서버 환경변수 ADMIN_PASSWORD 로만 확인 (브라우저에 노출 X)
 * - 로그인 성공 시 httpOnly 쿠키로 세션 토큰 발급
 * - 세션 토큰 = HMAC(비밀번호, SECRET) → 비번을 담지 않고 위조 불가
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234'
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'molip-flow-and-me-change-this-secret'

export const ADMIN_COOKIE = 'molip_admin'

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export function checkPassword(pw: unknown): boolean {
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
  if (!token) return false
  return safeEqual(token, sessionToken())
}
