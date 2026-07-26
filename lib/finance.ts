import { Reservation, DAY_PASS, MEMBERSHIP } from './types'

// 월 고정비 항목
export interface CostItem {
  label: string
  amount: number
}

export interface CostSettings {
  items: CostItem[]
  updatedAt: number
}

// 기본 고정비 항목 (금액 0으로 시작 — 사장님이 채워 넣음)
export const DEFAULT_COST_ITEMS: CostItem[] = [
  { label: '월세', amount: 0 },
  { label: '공과금 (전기·수도·가스)', amount: 0 },
  { label: '인터넷·통신', amount: 0 },
  { label: '소모품 (물·비품)', amount: 0 },
  { label: '기타', amount: 0 },
]

export interface MonthlyPnL {
  month: string // 'YYYY-MM'
  revenue: number
  fixedCost: number
  profit: number
  // 종류별 매출·건수
  breakdown: {
    space: { count: number; amount: number }
    membership: { count: number; amount: number }
    program: { count: number; amount: number }
    gift: { count: number; amount: number }
  }
  // 손익분기 지표
  bepDayPasses: number // 고정비를 24시간권만으로 메우려면 필요한 월 인원
  bepPerDay: number // 하루 평균 필요 인원
  currentPerDay: number // 이번 달 현재 하루 평균 방문(결제) 건수
  bepMembers: number // 멤버십만으로 메우려면 필요한 멤버 수
  memberEqualsPasses: number // 멤버 1명 = 24시간권 몇 명분
  daysElapsed: number // 이번 달 경과 일수 (진행 중이면 오늘까지)
  daysInMonth: number
}

/** 'YYYY-MM' 형식으로 변환 */
export function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** 결제 확정 시각 기준 월 (paidAt 없으면 createdAt) */
function monthOf(r: Reservation): string {
  const iso = r.paidAt || r.createdAt
  return iso.slice(0, 7)
}

/** 최근 N개월 키 목록 (최신순) */
export function recentMonths(n = 12): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    out.push(toMonthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)))
  }
  return out
}

/**
 * 특정 월의 손익을 계산한다.
 * 매출은 status==='paid' 인 건만 집계 (리드·미입금 제외).
 */
export function computeMonthlyPnL(
  reservations: Reservation[],
  month: string,
  fixedCost: number
): MonthlyPnL {
  const paid = reservations.filter(
    (r) => r.status === 'paid' && r.kind !== 'lead' && monthOf(r) === month
  )

  const breakdown = {
    space: { count: 0, amount: 0 },
    membership: { count: 0, amount: 0 },
    program: { count: 0, amount: 0 },
    gift: { count: 0, amount: 0 },
  }
  for (const r of paid) {
    const kind = (r.kind ?? 'space') as keyof typeof breakdown
    if (breakdown[kind]) {
      breakdown[kind].count += 1
      breakdown[kind].amount += r.amount || 0
    }
  }

  const revenue = paid.reduce((s, r) => s + (r.amount || 0), 0)
  const profit = revenue - fixedCost

  // 월 일수 / 경과 일수
  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()
  const now = new Date()
  const isCurrent = toMonthKey(now) === month
  const daysElapsed = isCurrent ? now.getDate() : daysInMonth

  // 손익분기
  const bepDayPasses = Math.ceil(fixedCost / DAY_PASS.price)
  const bepPerDay = Math.round((bepDayPasses / daysInMonth) * 10) / 10
  const currentPerDay =
    daysElapsed > 0 ? Math.round((paid.length / daysElapsed) * 10) / 10 : 0
  const bepMembers = Math.ceil(fixedCost / MEMBERSHIP.price)
  const memberEqualsPasses = Math.round(MEMBERSHIP.price / DAY_PASS.price)

  return {
    month,
    revenue,
    fixedCost,
    profit,
    breakdown,
    bepDayPasses,
    bepPerDay,
    currentPerDay,
    bepMembers,
    memberEqualsPasses,
    daysElapsed,
    daysInMonth,
  }
}

/** 고정비 합계 */
export function totalCost(items: CostItem[]): number {
  return items.reduce((s, i) => s + (Number(i.amount) || 0), 0)
}
