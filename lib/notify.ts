/**
 * 사장님 알림 (ntfy.sh 무료 푸시).
 *
 * 사장님 폰에 ntfy 앱을 설치하고 아래 토픽을 구독하면,
 * 새 예약/결제 때마다 푸시 알림이 도착한다.
 * 토픽 이름이 곧 비밀번호이므로 추측하기 어렵게 유지할 것.
 * (Vercel 환경변수 NTFY_TOPIC으로 교체 가능)
 */
const TOPIC = process.env.NTFY_TOPIC || 'molip-flow-me-alim-8291'
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL

async function sendNtfy(title: string, message: string) {
  const url =
    `https://ntfy.sh/${TOPIC}` +
    `?title=${encodeURIComponent(title)}&priority=high&tags=bell`
  await fetch(url, {
    method: 'POST',
    body: message,
    signal: AbortSignal.timeout(5000),
  })
}

async function sendSlack(title: string, message: string) {
  if (!SLACK_WEBHOOK) return
  await fetch(SLACK_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `*${title}*\n${message}`,
    }),
    signal: AbortSignal.timeout(5000),
  })
}

export async function notifyOwner(title: string, message: string) {
  // 두 채널 모두 시도하되, 실패해도 예약 흐름은 막지 않는다.
  const results = await Promise.allSettled([
    sendNtfy(title, message),
    sendSlack(title, message),
  ])
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('[notify] 알림 전송 실패(무시):', r.reason)
    }
  }
}
