import { NextRequest, NextResponse } from 'next/server'
import { rateLimitOk } from './db'

// 클라이언트 IP 추출 (Vercel은 x-forwarded-for 제공)
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * 레이트 리밋 가드. 초과 시 429 응답을 반환하고, 통과 시 null.
 *   const limited = await rateLimit(req, 'lead', 15, 3600)
 *   if (limited) return limited
 */
export async function rateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowSec: number
): Promise<NextResponse | null> {
  const ip = clientIp(req)
  const ok = await rateLimitOk(`${bucket}:${ip}`, limit, windowSec)
  if (ok) return null
  return NextResponse.json(
    { error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' },
    { status: 429 }
  )
}

// 저장 전 문자열 정리 (길이 제한 + 앞뒤 공백 제거)
export function clean(v: unknown, max = 200): string {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, max)
}
