'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CostItem, MonthlyPnL } from '@/lib/finance'

interface TrendPoint {
  month: string
  revenue: number
  profit: number
}

const won = (n: number) => `${n.toLocaleString()}원`
const monthLabel = (m: string) => {
  const [y, mm] = m.split('-')
  return `${y}년 ${Number(mm)}월`
}

export default function FinancePage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('')
  const [months, setMonths] = useState<string[]>([])
  const [items, setItems] = useState<CostItem[]>([])
  const [pnl, setPnl] = useState<MonthlyPnL | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  const load = useCallback(async (m?: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/finance${m ? `?month=${m}` : ''}`)
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    const data = await res.json()
    setItems(data.items ?? [])
    setPnl(data.pnl ?? null)
    setTrend(data.trend ?? [])
    setMonths(data.months ?? [])
    setMonth(data.pnl?.month ?? '')
    setAuthed(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function updateItem(i: number, patch: Partial<CostItem>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }
  function addItem() {
    setItems((arr) => [...arr, { label: '', amount: 0 }])
  }
  function removeItem(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i))
  }

  async function saveCosts() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) {
        alert('저장에 실패했어요.')
        return
      }
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 2000)
      await load(month)
    } finally {
      setSaving(false)
    }
  }

  if (authed === false) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-sm text-gray-500 mb-4">관리자 로그인이 필요해요.</p>
        <a href="/admin" className="text-sm underline text-[#3b2e21]">
          로그인하러 가기 →
        </a>
      </main>
    )
  }

  const inputCls =
    'rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-2.5 text-sm focus:outline-none focus:border-[#3b2e21] transition'

  const fixedCost = items.reduce((s, i) => s + (Number(i.amount) || 0), 0)
  const profitPositive = (pnl?.profit ?? 0) >= 0
  const gapPerDay = pnl ? Math.max(0, Math.round((pnl.bepPerDay - pnl.currentPerDay) * 10) / 10) : 0
  const maxAbs = Math.max(1, ...trend.map((t) => Math.abs(t.revenue)))

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#3b2e21]">📊 채산표</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            고정비만 넣으면, 매출은 예약 데이터에서 자동으로 계산돼요
          </p>
        </div>
        <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          ← 대시보드
        </a>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-gray-400">불러오는 중...</div>
      ) : (
        <>
          {/* 월 선택 */}
          <div className="flex items-center gap-2 mb-6">
            <label className="text-sm text-gray-500">기준 월</label>
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value)
                load(e.target.value)
              }}
              className={inputCls}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          {/* 손익 요약 */}
          {pnl && (
            <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6 mb-6">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <div className="text-[11px] text-gray-400 mb-1">매출</div>
                  <div className="text-lg font-bold text-[#3b2e21]">{won(pnl.revenue)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 mb-1">고정비</div>
                  <div className="text-lg font-bold text-gray-500">−{won(pnl.fixedCost)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 mb-1">순익</div>
                  <div
                    className={`text-lg font-bold ${
                      profitPositive ? 'text-[#2a7d72]' : 'text-[#c2553a]'
                    }`}
                  >
                    {profitPositive ? '+' : '−'}
                    {won(Math.abs(pnl.profit))}
                  </div>
                </div>
              </div>

              {/* 종류별 매출 */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5">
                {(
                  [
                    ['space', '🕐 공간 예약'],
                    ['membership', '💳 멤버십'],
                    ['program', '🪑 4주 프로그램'],
                    ['gift', '🎁 선물권'],
                  ] as const
                ).map(([k, label]) => {
                  const b = pnl.breakdown[k]
                  return (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {label}
                        <span className="text-gray-300 ml-2">{b.count}건</span>
                      </span>
                      <span className="text-[#3b2e21] font-medium">{won(b.amount)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 손익분기 */}
          {pnl && pnl.fixedCost > 0 && (
            <div className="rounded-2xl border border-[#e9c46a]/40 bg-[#e9c46a]/[0.07] p-6 mb-6">
              <p className="text-xs tracking-[0.2em] text-[#b8860b] uppercase mb-4">
                손익분기 (BEP)
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-600">24시간권만으로 메우려면</span>
                  <span className="font-bold text-[#3b2e21]">
                    월 {pnl.bepDayPasses}명
                    <span className="text-gray-400 font-normal ml-2">
                      (하루 {pnl.bepPerDay}명)
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-600">멤버십만으로 메우려면</span>
                  <span className="font-bold text-[#3b2e21]">멤버 {pnl.bepMembers}명</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-600">지금 페이스</span>
                  <span className="font-bold text-[#3b2e21]">
                    하루 {pnl.currentPerDay}명
                    <span className="text-gray-400 font-normal ml-2">
                      ({pnl.daysElapsed}일 경과)
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#e9c46a]/30 space-y-2">
                {gapPerDay > 0 ? (
                  <p className="text-sm text-[#3b2e21]">
                    → 손익분기까지 <strong>하루 {gapPerDay}명</strong> 더 필요해요.
                  </p>
                ) : (
                  <p className="text-sm text-[#2a7d72] font-medium">
                    → 지금 페이스면 손익분기를 넘어요 🎉
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  💡 <strong className="text-[#3b2e21]">멤버 1명 = 24시간권 {pnl.memberEqualsPasses}명분.</strong>{' '}
                  멤버 {pnl.bepMembers}명이면 고정비가 해결돼요.
                </p>
              </div>
            </div>
          )}

          {/* 최근 6개월 추이 */}
          {trend.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6 mb-6">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                최근 6개월 매출
              </p>
              <div className="space-y-2">
                {[...trend].reverse().map((t) => (
                  <div key={t.month} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-xs text-gray-400 tabular-nums">
                      {Number(t.month.split('-')[1])}월
                    </span>
                    <div className="flex-1 h-5 rounded-md bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-md bg-[#7f8f5a] transition-all"
                        style={{ width: `${(t.revenue / maxAbs) * 100}%` }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs text-[#3b2e21] tabular-nums">
                      {t.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 고정비 입력 */}
          <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#3b2e21]">월 고정비</p>
              <span className="text-sm font-bold text-[#3b2e21]">{won(fixedCost)}</span>
            </div>
            <div className="space-y-2 mb-4">
              {items.map((it, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={it.label}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                    placeholder="항목명"
                    className={`${inputCls} flex-1 min-w-0`}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={it.amount || ''}
                    onChange={(e) => updateItem(i, { amount: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className={`${inputCls} w-28 text-right`}
                  />
                  <button
                    onClick={() => removeItem(i)}
                    className="shrink-0 px-3 text-sm text-gray-300 hover:text-red-500 transition"
                    aria-label="항목 삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition"
              >
                + 항목 추가
              </button>
              <button
                onClick={saveCosts}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition disabled:opacity-40"
              >
                {savedOk ? '저장됐어요 ✓' : saving ? '저장 중...' : '고정비 저장'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              한 번 저장하면 계속 유지돼요. 매출은 입금 확인된 건만 자동 집계됩니다.
            </p>
          </div>
        </>
      )}
    </main>
  )
}
