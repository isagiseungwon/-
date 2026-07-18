import { NextResponse } from 'next/server'

/**
 * 진단용 임시 라우트: 어떤 저장소 관련 환경변수가 주입됐는지 "이름만" 보여준다.
 * 비밀 값(토큰 등)은 절대 노출하지 않는다. 진단 후 삭제 예정.
 */
export async function GET() {
  const pattern = /REDIS|KV|UPSTASH|STORAGE|REST|DATABASE|VALKEY/i
  const matchedKeys = Object.keys(process.env)
    .filter((k) => pattern.test(k))
    .sort()

  // 값 자체는 노출하지 않되, URL 형태인지 여부만 표시(진단용)
  const hints = matchedKeys.map((k) => {
    const v = process.env[k] ?? ''
    let shape = 'value'
    if (/^https?:\/\//i.test(v)) shape = 'https-url'
    else if (/^rediss?:\/\//i.test(v)) shape = 'redis-url'
    else if (v.length > 20) shape = 'token-like'
    return { name: k, shape }
  })

  return NextResponse.json({
    matchedKeys,
    hints,
    total_env_count: Object.keys(process.env).length,
  })
}
