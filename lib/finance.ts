import { Reservation, DAY_PASS, MEMBERSHIP } from './types'

// ───────── 고정비 ─────────
export interface CostItem {
  label: string
  amount: number
}

export const DEFAULT_COST_ITEMS: CostItem[] = [
  { label: '월세', amount: 0 },
  { label: '공과금 (전기·수도·가스)', amount: 0 },
  { label: '인터넷·통신', amount: 0 },
  { label: '소모품 (물·비품)', amount: 0 },
  { label: '기타', amount: 0 },
]

// ───────── 직접 입력 거래 ─────────
export type EntryType = 'income' | 'expense'

export interface ManualEntry {
  id: string
  date: string // 'YYYY-MM-DD'
  type: EntryType
  label: string
  amount: number
  memo?: string
  createdAt: number
}

export const QUICK_INCOME = ['현금 결제', '계좌이체 (직접)', '단체 대관', '기타 매출']
export const QUICK_EXPENSE = [
  '물·음료 구입',
  '청소·소모품',
  '비품 구입',
  '광고비',
  '수수료',
  '기타 지출',
]

// ───────── 세금 설정 ─────────
export type TaxType = 'simple' | 'general' // 간이과세자 / 일반과세자

export interface TaxSettings {
  taxType: TaxType
  vatRate: number // 간이과세 업종별 부가가치율 (%)
}

export const DEFAULT_TAX_SETTINGS: TaxSettings = { taxType: 'simple', vatRate: 30 }

// 간이과세 업종별 부가가치율 (국세청 기준)
export const VAT_RATE_OPTIONS = [
  { rate: 15, label: '소매업·음식점업 (15%)' },
  { rate: 20, label: '제조업·농림어업 (20%)' },
  { rate: 25, label: '숙박업 (25%)' },
  { rate: 30, label: '그 밖의 서비스업 (30%) — 스터디카페 일반적' },
  { rate: 40, label: '부동산임대·임대서비스업 (40%)' },
]

export const SIMPLE_TAX_LIMIT = 104_000_000 // 간이과세 기준: 직전연도 공급대가 1억 400만원 미만
export const VAT_EXEMPT_LIMIT = 48_000_000 // 연 공급대가 4,800만원 미만 → 부가세 납부 면제

// 종합소득세 누진세율 (과세표준 기준)
export const INCOME_TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, deduct: 0 },
  { upTo: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { upTo: 500_000_000, rate: 0.4, deduct: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { upTo: Infinity, rate: 0.45, deduct: 65_940_000 },
]

// ───────── 월 손익 ─────────
export interface MonthlyPnL {
  month: string
  siteRevenue: number
  manualIncome: number
  revenue: number
  fixedCost: number
  variableCost: number
  totalCost: number
  profit: number
  breakdown: {
    space: { count: number; amount: number }
    membership: { count: number; amount: number }
    program: { count: number; amount: number }
    gift: { count: number; amount: number }
  }
  bepDayPasses: number
  bepPerDay: number
  currentPerDay: number
  bepMembers: number
  memberEqualsPasses: number
  daysElapsed: number
  daysInMonth: number
  projectedRevenue: number // 이 페이스로 갈 때 월말 예상 매출
  projectedProfit: number // 월말 예상 순이익
  isEarly: boolean // 월초라 추정이 불안정한 구간(5일 미만)
}

export function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthOf(r: Reservation): string {
  return (r.paidAt || r.createdAt).slice(0, 7)
}

export function recentMonths(n = 12): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    out.push(toMonthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)))
  }
  return out
}

export function totalCost(items: CostItem[]): number {
  return items.reduce((s, i) => s + (Number(i.amount) || 0), 0)
}

/** 특정 월 손익. 매출은 결제 완료(paid) 건 + 직접 입력한 매출. */
export function computeMonthlyPnL(
  reservations: Reservation[],
  entries: ManualEntry[],
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

  const siteRevenue = paid.reduce((s, r) => s + (r.amount || 0), 0)
  const monthEntries = entries.filter((e) => e.date.slice(0, 7) === month)
  const manualIncome = monthEntries
    .filter((e) => e.type === 'income')
    .reduce((s, e) => s + e.amount, 0)
  const variableCost = monthEntries
    .filter((e) => e.type === 'expense')
    .reduce((s, e) => s + e.amount, 0)

  const revenue = siteRevenue + manualIncome
  const totalCostSum = fixedCost + variableCost
  const profit = revenue - totalCostSum

  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()
  const now = new Date()
  const daysElapsed = toMonthKey(now) === month ? now.getDate() : daysInMonth

  const bepDayPasses = totalCostSum > 0 ? Math.ceil(totalCostSum / DAY_PASS.price) : 0
  const bepPerDay = Math.round((bepDayPasses / daysInMonth) * 10) / 10
  const currentPerDay =
    daysElapsed > 0 ? Math.round((paid.length / daysElapsed) * 10) / 10 : 0
  const bepMembers = totalCostSum > 0 ? Math.ceil(totalCostSum / MEMBERSHIP.price) : 0
  const memberEqualsPasses = Math.round(MEMBERSHIP.price / DAY_PASS.price)

  // 이 페이스로 월말까지 갔을 때 예상치 (금액 기준이라 멤버십·프로그램도 반영됨)
  const projectedRevenue =
    daysElapsed > 0 ? Math.round((revenue / daysElapsed) * daysInMonth) : 0
  const projectedProfit = projectedRevenue - totalCostSum

  return {
    month,
    siteRevenue,
    manualIncome,
    revenue,
    fixedCost,
    variableCost,
    totalCost: totalCostSum,
    profit,
    breakdown,
    bepDayPasses,
    bepPerDay,
    currentPerDay,
    bepMembers,
    memberEqualsPasses,
    daysElapsed,
    daysInMonth,
    projectedRevenue,
    projectedProfit,
    isEarly: daysElapsed < 5,
  }
}

// ───────── 세금 예상 ─────────
export interface TaxEstimate {
  yearRevenue: number
  yearProfit: number
  monthsCounted: number
  isProjected: boolean
  vat: number
  vatExempt: boolean
  vatNote: string
  incomeTax: number
  incomeTaxRate: number
  localTax: number
  totalTax: number
  monthlyReserve: number
}

/**
 * 세금 예상치. ⚠️ 공제·경비 인정 범위에 따라 실제 세액은 달라지는 참고용 추정.
 */
export function estimateTax(
  yearRevenue: number,
  yearProfit: number,
  monthsCounted: number,
  settings: TaxSettings
): TaxEstimate {
  const isProjected = monthsCounted > 0 && monthsCounted < 12

  let vat = 0
  let vatExempt = false
  let vatNote = ''

  if (settings.taxType === 'simple') {
    if (yearRevenue < VAT_EXEMPT_LIMIT) {
      vatExempt = true
      vatNote = '연매출 4,800만원 미만이라 부가세 납부가 면제돼요. (신고는 해야 해요)'
    } else {
      vat = Math.round(yearRevenue * (settings.vatRate / 100) * 0.1)
      vatNote = `간이과세: 매출 × 부가가치율 ${settings.vatRate}% × 10%`
    }
  } else {
    vat = Math.round((yearRevenue * 10) / 110)
    vatNote = '일반과세: 매출세액만 계산(매입세액 공제 전) — 실제론 더 줄어들어요'
  }

  const base = Math.max(0, yearProfit)
  const bracket =
    INCOME_TAX_BRACKETS.find((b) => base <= b.upTo) ??
    INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1]
  const incomeTax = Math.max(0, Math.round(base * bracket.rate - bracket.deduct))
  const localTax = Math.round(incomeTax * 0.1)
  const totalTax = vat + incomeTax + localTax

  return {
    yearRevenue,
    yearProfit,
    monthsCounted,
    isProjected,
    vat,
    vatExempt,
    vatNote,
    incomeTax,
    incomeTaxRate: Math.round(bracket.rate * 100),
    localTax,
    totalTax,
    monthlyReserve: Math.round(totalTax / 12),
  }
}

export const TAX_CALENDAR = [
  {
    when: '1월 25일',
    what: '부가가치세 신고·납부',
    who: '간이과세자는 1년치 한 번 / 일반과세자는 하반기분',
  },
  {
    when: '5월 1~31일',
    what: '종합소득세 신고·납부',
    who: '작년 한 해 번 돈 전체 (모든 개인사업자)',
  },
  { when: '7월 25일', what: '부가가치세 신고·납부', who: '일반과세자만 (상반기분)' },
]

export const TERMS = [
  {
    term: '매출',
    plain: '손님한테 받은 돈 전부',
    detail: '비용 빼기 전. 4,500원 100명이면 매출 45만원.',
  },
  {
    term: '비용',
    plain: '가게 굴리는 데 나간 돈',
    detail: '월세·공과금 같은 고정비 + 물·비품 같은 그때그때 나가는 돈.',
  },
  {
    term: '당기순이익',
    plain: '매출에서 비용 다 빼고 진짜 남은 돈',
    detail: '이게 "내가 번 돈". 세금은 여기에 매겨져요.',
  },
  {
    term: '부가가치세 (부가세)',
    plain: '손님이 낸 값에 포함된 세금, 대신 보관했다 내는 것',
    detail: '내 돈이 아니라 잠시 맡아둔 돈이라고 생각하면 편해요. 간이과세자는 1월에 냅니다.',
  },
  {
    term: '종합소득세 (종소세)',
    plain: '1년 동안 번 돈(순이익)에 매기는 세금',
    detail: '매년 5월에 작년치를 신고·납부해요. 많이 벌수록 세율이 올라갑니다.',
  },
  {
    term: '간이과세자',
    plain: '연매출 1억 400만원 미만인 작은 사업자',
    detail: '세금 계산이 간단하고, 연매출 4,800만원 미만이면 부가세를 안 내요.',
  },
]
