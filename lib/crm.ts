import { Reservation, EntryKind } from './types'

// 전화번호를 저장 키로 정규화 (숫자만). 클라이언트에서도 쓰이므로 순수 함수로 여기 둔다.
export function normalizePhone(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '')
}

// 고객 단계
export type CustomerStage = 'lead' | 'new' | 'regular' | 'member' | 'dormant'

export interface CustomerEvent {
  kind: EntryKind
  status: Reservation['status']
  amount: number
  date: string // 활동 날짜 (createdAt 기준)
  createdAt: string
  label: string // 사람이 읽는 요약
  wish?: string
}

export interface Customer {
  phone: string // 표시용(원본 유지)
  phoneKey: string // 정규화 키
  name: string
  stage: CustomerStage
  isMember: boolean
  memberDday: number | null // 멤버십 남은 일수
  visitCount: number // 결제 완료된 공간/프로그램/멤버십 건수
  totalSpent: number // 결제 완료 합계
  leadType: string | null // 몰입 유형(테스트 리드였다면)
  firstSeen: string
  lastActivity: string
  daysSinceActivity: number
  events: CustomerEvent[]
  note: string
}

const DAY = 24 * 60 * 60 * 1000

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY)
}

function kindLabel(r: Reservation): string {
  switch (r.kind) {
    case 'program':
      return '4주 프로그램 신청'
    case 'membership':
      return '멤버십'
    case 'gift':
      return `선물권${r.wish ? ` (${r.wish})` : ''}`
    case 'lead':
      return `몰입 테스트 리드`
    default:
      return `공간 예약 (${r.date} ${r.time})`
  }
}

// 리드 wish에서 유형명만 뽑기 (예: "🔥 점화력 좋은 작심삼일 실행가 · 환경..")
function extractLeadType(wish?: string): string | null {
  if (!wish) return null
  const m = wish.split('·')[0]?.trim()
  return m || null
}

/** 예약/리드 원장을 전화번호 기준으로 묶어 고객 프로필 목록을 만든다 */
export function buildCustomers(
  reservations: Reservation[],
  notes: Record<string, string>
): Customer[] {
  const map = new Map<string, Reservation[]>()
  for (const r of reservations) {
    const key = normalizePhone(r.phone)
    if (!key) continue
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  }

  const customers: Customer[] = []
  for (const [phoneKey, rows] of map) {
    rows.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const named = [...rows].reverse().find((r) => r.name && r.name !== '이름 미기재')
    const name = named?.name ?? rows[0].name ?? '이름 미기재'
    const phone = named?.phone ?? rows[0].phone

    const paid = rows.filter((r) => r.status === 'paid' && r.kind !== 'lead')
    const totalSpent = paid.reduce((s, r) => s + (r.amount || 0), 0)
    const visitCount = paid.length

    // 멤버십 유효성
    const paidMemberships = rows
      .filter((r) => r.kind === 'membership' && r.status === 'paid' && r.paidAt)
      .sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime())
    let isMember = false
    let memberDday: number | null = null
    if (paidMemberships.length) {
      const exp = new Date(paidMemberships[0].paidAt!).getTime() + 30 * DAY
      memberDday = Math.ceil((exp - Date.now()) / DAY)
      isMember = memberDday > 0
    }

    const leadRow = rows.find((r) => r.kind === 'lead')
    const leadType = extractLeadType(leadRow?.wish)

    const firstSeen = rows[0].createdAt
    const lastActivity = rows[rows.length - 1].createdAt
    const daysSinceActivity = daysAgo(lastActivity)

    // 단계 판정
    let stage: CustomerStage
    if (isMember) stage = 'member'
    else if (visitCount >= 3) stage = 'regular'
    else if (visitCount >= 1) stage = 'new'
    else stage = 'lead'
    // 휴면: 결제 이력이 있는데 21일 이상 활동 없음
    if (stage !== 'member' && visitCount >= 1 && daysSinceActivity >= 21) {
      stage = 'dormant'
    }

    const events: CustomerEvent[] = rows
      .map((r) => ({
        kind: (r.kind ?? 'space') as EntryKind,
        status: r.status,
        amount: r.amount || 0,
        date: r.createdAt.split('T')[0],
        createdAt: r.createdAt,
        label: kindLabel(r),
        wish: r.wish,
      }))
      .reverse()

    customers.push({
      phone,
      phoneKey,
      name,
      stage,
      isMember,
      memberDday,
      visitCount,
      totalSpent,
      leadType,
      firstSeen,
      lastActivity,
      daysSinceActivity,
      events,
      note: notes[phoneKey] ?? '',
    })
  }

  // 최근 활동 순
  customers.sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  )
  return customers
}

// ───────── 오늘 할 일(영업 지시서) ─────────
export type ActionType = 'lead_followup' | 'revisit_nudge' | 'member_expiring' | 'winback'

export interface ActionItem {
  type: ActionType
  emoji: string
  title: string // 무엇을
  customer: Customer
  reason: string // 왜 지금
  templateKey: 'report' | 'revisit' | 'member_extend' | 'winback'
}

/** 고객 목록에서 "오늘 챙길 사람"을 우선순위대로 뽑는다 */
export function buildActionItems(customers: Customer[]): ActionItem[] {
  const items: ActionItem[] = []

  for (const c of customers) {
    // 1) 리드 팔로업: 아직 결제 없는 리드, 접수 후 시간 경과
    if (c.stage === 'lead' && c.leadType) {
      const hrs = (Date.now() - new Date(c.lastActivity).getTime()) / (60 * 60 * 1000)
      if (hrs >= 12) {
        items.push({
          type: 'lead_followup',
          emoji: '🧭',
          title: `${c.name}님께 결과 리포트 보내기`,
          customer: c,
          reason:
            hrs >= 24
              ? `테스트 신청 ${Math.floor(hrs / 24)}일 경과 — 아직 리포트 전이라면 지금!`
              : '테스트 신청 후 반나절 경과 — 24시간 안에 보내는 게 핵심',
          templateKey: 'report',
        })
      }
    }

    // 2) 멤버십 만료 임박/만료
    if (c.isMember && c.memberDday !== null && c.memberDday <= 5) {
      items.push({
        type: 'member_expiring',
        emoji: '💳',
        title: `${c.name}님 멤버십 연장 안내`,
        customer: c,
        reason: `멤버십 D-${c.memberDday} — 연장 안내 타이밍`,
        templateKey: 'member_extend',
      })
    }
    if (!c.isMember && c.memberDday !== null && c.memberDday <= 0 && c.memberDday >= -7) {
      items.push({
        type: 'member_expiring',
        emoji: '💳',
        title: `${c.name}님 멤버십 만료 — 재가입 권유`,
        customer: c,
        reason: `${-c.memberDday}일 전 만료 — 지금이 되살릴 골든타임`,
        templateKey: 'member_extend',
      })
    }

    // 3) 첫 방문 후 재방문 넛지 (신규, 7~20일)
    if (
      c.stage === 'new' &&
      c.daysSinceActivity >= 7 &&
      c.daysSinceActivity <= 20
    ) {
      items.push({
        type: 'revisit_nudge',
        emoji: '🌱',
        title: `${c.name}님 재방문 넛지`,
        customer: c,
        reason: `첫 방문 후 ${c.daysSinceActivity}일 — 두 번째 방문을 만드는 타이밍`,
        templateKey: 'revisit',
      })
    }

    // 4) 휴면 단골 되살리기
    if (c.stage === 'dormant') {
      items.push({
        type: 'winback',
        emoji: '😴',
        title: `${c.name}님 안부 DM`,
        customer: c,
        reason: `방문 ${c.visitCount}회 단골이 ${c.daysSinceActivity}일째 조용 — 안부 한 통`,
        templateKey: 'winback',
      })
    }
  }

  // 우선순위: 멤버만료 > 리드팔로업 > 휴면 > 재방문, 그 안에서는 시급도 순
  const priority: Record<ActionType, number> = {
    member_expiring: 0,
    lead_followup: 1,
    winback: 2,
    revisit_nudge: 3,
  }
  items.sort((a, b) => priority[a.type] - priority[b.type])
  return items
}

export const STAGE_META: Record<
  CustomerStage,
  { label: string; emoji: string; color: string }
> = {
  lead: { label: '리드', emoji: '🧭', color: '#b8860b' },
  new: { label: '신규', emoji: '🌱', color: '#7f8f5a' },
  regular: { label: '단골', emoji: '🪑', color: '#3b2e21' },
  member: { label: '멤버', emoji: '💳', color: '#2563eb' },
  dormant: { label: '휴면', emoji: '😴', color: '#9ca3af' },
}
