'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CostItem, ManualEntry, MonthlyPnL, TaxEstimate, TaxSettings } from '@/lib/finance'
import { QUICK_INCOME, QUICK_EXPENSE, VAT_RATE_OPTIONS, TAX_CALENDAR, TERMS } from '@/lib/finance'

type Tab = 'pnl' | 'entry' | 'tax'
interface TrendPoint { month: string; revenue: number; profit: number }

const won = (n: number) => `${Math.round(n).toLocaleString()}원`
const manwon = (n: number) => `${Math.round(n / 10000).toLocaleString()}만원`
const monthLabel = (m: string) => `${m.split('-')[0]}년 ${Number(m.split('-')[1])}월`

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={`text-sm ${bold ? 'font-semibold text-[#3b2e21]' : 'text-gray-600'}`}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold text-[#3b2e21]' : 'text-gray-600'}`}>
        {value < 0 ? '−' : ''}{Math.abs(value).toLocaleString()}원
      </span>
    </div>
  )
}

function SubRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between pl-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs text-gray-400 tabular-nums">
        {value < 0 ? '−' : ''}{Math.abs(value).toLocaleString()}원
      </span>
    </div>
  )
}

export default function FinancePage() {
  const [tab, setTab] = useState<Tab>('pnl')
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('')
  const [months, setMonths] = useState<string[]>([])
  const [items, setItems] = useState<CostItem[]>([])
  const [tax, setTax] = useState<TaxSettings>({ taxType: 'simple', vatRate: 30 })
  const [pnl, setPnl] = useState<MonthlyPnL | null>(null)
  const [taxEst, setTaxEst] = useState<TaxEstimate | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [entries, setEntries] = useState<ManualEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)

  const [eType, setEType] = useState<'income' | 'expense'>('income')
  const [eDate, setEDate] = useState(new Date().toISOString().slice(0, 10))
  const [eLabel, setELabel] = useState('')
  const [eAmount, setEAmount] = useState('')
  const [adding, setAdding] = useState(false)

  const load = useCallback(async (m?: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/finance${m ? `?month=${m}` : ''}`)
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setItems(data.items ?? [])
    setTax(data.tax ?? { taxType: 'simple', vatRate: 30 })
    setPnl(data.pnl ?? null)
    setTaxEst(data.taxEstimate ?? null)
    setTrend(data.trend ?? [])
    setEntries(data.entries ?? [])
    setMonths(data.months ?? [])
    setMonth(data.pnl?.month ?? '')
    setAuthed(true)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function addEntry() {
    const amt = Number(eAmount) || 0
    if (!eLabel.trim() || amt <= 0 || adding) return
    setAdding(true)
    try {
      const res = await fetch('/api/admin/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addEntry', type: eType, date: eDate, label: eLabel, amount: amt }),
      })
      if (!res.ok) { alert('저장에 실패했어요.'); return }
      setELabel(''); setEAmount('')
      await load(month)
    } finally { setAdding(false) }
  }

  async function removeEntry(id: string) {
    if (!confirm('이 내역을 삭제할까요?')) return
    await fetch('/api/admin/finance', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load(month)
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, taxType: tax.taxType, vatRate: tax.vatRate }),
      })
      if (!res.ok) { alert('저장에 실패했어요.'); return }
      setSavedOk(true); setTimeout(() => setSavedOk(false), 2000)
      await load(month)
    } finally { setSaving(false) }
  }

  if (authed === false) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-sm text-gray-500 mb-4">관리자 로그인이 필요해요.</p>
        <a href="/admin" className="text-sm underline text-[#3b2e21]">로그인하러 가기 →</a>
      </main>
    )
  }

  const inputCls = 'rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-2.5 text-sm focus:outline-none focus:border-[#3b2e21] transition'
  const card = 'rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6'
  const fixedCost = items.reduce((s, i) => s + (Number(i.amount) || 0), 0)
  const positive = (pnl?.profit ?? 0) >= 0
  const gap = pnl ? Math.max(0, Math.round((pnl.bepPerDay - pnl.currentPerDay) * 10) / 10) : 0
  const maxRev = Math.max(1, ...trend.map((t) => t.revenue))

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#3b2e21]">📊 채산표</h1>
          <p className="text-sm text-gray-500 mt-0.5">세무 몰라도 괜찮아요. 숫자만 넣으면 알려드려요</p>
        </div>
        <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← 대시보드</a>
      </div>

      <div className="flex gap-2 mb-6">
        {([['pnl', '💰 손익'], ['entry', '📥 입력'], ['tax', '🧾 세금']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === t ? 'bg-[#3b2e21] text-white' : 'bg-[#fdfaf4] border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>{label}</button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <label className="text-sm text-gray-500">기준 월</label>
        <select value={month} onChange={(e) => { setMonth(e.target.value); load(e.target.value) }} className={inputCls}>
          {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-gray-400">불러오는 중...</div>
      ) : (
        <>
          {/* ═══ 손익 ═══ */}
          {tab === 'pnl' && pnl && (
            <>
              <div className={`${card} mb-4`}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-5">손익계산서</p>
                <div className="space-y-3">
                  <Row label="매출 (손님한테 받은 돈)" value={pnl.revenue} bold />
                  <SubRow label="· 사이트 결제" value={pnl.siteRevenue} />
                  <SubRow label="· 직접 입력 (현금 등)" value={pnl.manualIncome} />
                  <div className="border-t border-gray-100 pt-3" />
                  <Row label="비용 (나간 돈)" value={-pnl.totalCost} bold />
                  <SubRow label="· 고정비 (월세·공과금 등)" value={-pnl.fixedCost} />
                  <SubRow label="· 그 외 지출" value={-pnl.variableCost} />
                  <div className="border-t-2 border-[#3b2e21]/15 pt-3" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-bold text-[#3b2e21]">
                      당기순이익 <span className="text-xs font-normal text-gray-400">진짜 남은 돈</span>
                    </span>
                    <span className={`text-xl font-bold ${positive ? 'text-[#2a7d72]' : 'text-[#c2553a]'}`}>
                      {positive ? '+' : '−'}{won(Math.abs(pnl.profit))}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${card} mb-4`}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">사이트 매출 내역</p>
                <div className="space-y-1.5">
                  {([['space', '🕐 공간 예약'], ['membership', '💳 멤버십'], ['program', '🪑 4주 프로그램'], ['gift', '🎁 선물권']] as const).map(([k, label]) => {
                    const b = pnl.breakdown[k]
                    return (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{label}<span className="text-gray-300 ml-2">{b.count}건</span></span>
                        <span className="text-[#3b2e21] font-medium">{won(b.amount)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {pnl.totalCost > 0 && (
                <div className="rounded-2xl border border-[#e9c46a]/40 bg-[#e9c46a]/[0.07] p-6 mb-4">
                  <p className="text-xs tracking-[0.2em] text-[#b8860b] uppercase mb-1">손익분기</p>
                  <p className="text-xs text-gray-500 mb-4">본전 치려면 얼마나 와야 하나</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-600">24시간권 손님으로만</span>
                      <span className="font-bold text-[#3b2e21]">월 {pnl.bepDayPasses}명<span className="text-gray-400 font-normal ml-2">(하루 {pnl.bepPerDay}명)</span></span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-600">멤버십으로만</span>
                      <span className="font-bold text-[#3b2e21]">멤버 {pnl.bepMembers}명</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-600">지금 페이스</span>
                      <span className="font-bold text-[#3b2e21]">하루 {pnl.currentPerDay}명<span className="text-gray-400 font-normal ml-2">({pnl.daysElapsed}일 경과)</span></span>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#e9c46a]/30 space-y-2">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-gray-600">이 페이스면 월말 매출</span>
                      <span className="font-bold text-[#3b2e21]">{won(pnl.projectedRevenue)}</span>
                    </div>
                    {pnl.projectedProfit >= 0 ? (
                      <p className="text-sm text-[#2a7d72] font-medium">
                        → 이 페이스면 월말에 <strong>{won(pnl.projectedProfit)} 남아요</strong> 🎉
                      </p>
                    ) : (
                      <p className="text-sm text-[#3b2e21]">
                        → 이 페이스면 월말에 <strong className="text-[#c2553a]">{won(Math.abs(pnl.projectedProfit))} 부족</strong>해요.
                        {gap > 0 && <> 하루 <strong>{gap}명</strong>만 더 오면 본전이에요.</>}
                      </p>
                    )}
                    {pnl.isEarly && (
                      <p className="text-xs text-gray-400">
                        ※ 아직 {pnl.daysElapsed}일치라 예상이 많이 흔들려요. 참고만 하세요.
                      </p>
                    )}
                    <p className="text-sm text-gray-600 pt-1">
                      💡 <strong className="text-[#3b2e21]">멤버 1명 = 24시간권 {pnl.memberEqualsPasses}명분.</strong> 멤버 {pnl.bepMembers}명이면 비용이 해결돼요.
                    </p>
                  </div>
                </div>
              )}

              <div className={card}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">최근 6개월 매출</p>
                <div className="space-y-2">
                  {[...trend].reverse().map((t) => (
                    <div key={t.month} className="flex items-center gap-3">
                      <span className="w-10 shrink-0 text-xs text-gray-400 tabular-nums">{Number(t.month.split('-')[1])}월</span>
                      <div className="flex-1 h-5 rounded-md bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-md bg-[#7f8f5a]" style={{ width: `${(t.revenue / maxRev) * 100}%` }} />
                      </div>
                      <span className="w-20 shrink-0 text-right text-xs text-[#3b2e21] tabular-nums">{t.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══ 입력 ═══ */}
          {tab === 'entry' && (
            <>
              <div className={`${card} mb-4`}>
                <p className="text-sm font-semibold text-[#3b2e21] mb-1">현금 매출·지출 직접 입력</p>
                <p className="text-xs text-gray-500 mb-4">사이트 결제는 자동으로 잡혀요. 여기엔 <strong>현금·계좌로 직접 받은 돈</strong>과 <strong>나간 돈</strong>만 넣으면 돼요.</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {([['income', '💵 받은 돈'], ['expense', '💸 나간 돈']] as const).map(([t, label]) => (
                    <button key={t} onClick={() => { setEType(t); setELabel('') }}
                      className={`py-3 rounded-xl border text-sm font-medium transition ${
                        eType === t ? 'border-[#3b2e21] bg-[#3b2e21] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                      }`}>{label}</button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(eType === 'income' ? QUICK_INCOME : QUICK_EXPENSE).map((q) => (
                    <button key={q} onClick={() => setELabel(q)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        eLabel === q ? 'border-[#7f8f5a] bg-[#7f8f5a]/10 text-[#5f6b42] font-medium' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}>{q}</button>
                  ))}
                </div>

                <div className="space-y-2 mb-3">
                  <input value={eLabel} onChange={(e) => setELabel(e.target.value)} placeholder="항목 (예: 현금 결제)" className={`${inputCls} w-full`} />
                  <div className="flex gap-2">
                    <input type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} className={`${inputCls} flex-1`} />
                    <input type="number" inputMode="numeric" value={eAmount} onChange={(e) => setEAmount(e.target.value)} placeholder="금액" className={`${inputCls} w-32 text-right`} />
                  </div>
                </div>
                <button onClick={addEntry} disabled={!eLabel.trim() || !Number(eAmount) || adding}
                  className="w-full py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition disabled:opacity-40">
                  {adding ? '저장 중...' : '추가하기'}
                </button>
              </div>

              <div className={card}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">{month && monthLabel(month)} 입력 내역</p>
                {entries.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">아직 입력한 내역이 없어요.</p>
                ) : (
                  <div className="space-y-2">
                    {entries.map((e) => (
                      <div key={e.id} className="flex items-center gap-3 text-sm">
                        <span className="w-12 shrink-0 text-xs text-gray-400 tabular-nums">{e.date.slice(5)}</span>
                        <span className="flex-1 min-w-0 truncate text-gray-600">{e.label}</span>
                        <span className={`shrink-0 font-medium tabular-nums ${e.type === 'income' ? 'text-[#2a7d72]' : 'text-[#c2553a]'}`}>
                          {e.type === 'income' ? '+' : '−'}{e.amount.toLocaleString()}
                        </span>
                        <button onClick={() => removeEntry(e.id)} className="shrink-0 text-gray-300 hover:text-red-500 transition">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${card} mt-4`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-[#3b2e21]">매달 똑같이 나가는 돈 (고정비)</p>
                  <span className="text-sm font-bold text-[#3b2e21]">{won(fixedCost)}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">한 번만 넣으면 매달 자동으로 적용돼요.</p>
                <div className="space-y-2 mb-4">
                  {items.map((it, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={it.label} onChange={(e) => setItems((a) => a.map((x, ix) => ix === i ? { ...x, label: e.target.value } : x))} placeholder="항목명" className={`${inputCls} flex-1 min-w-0`} />
                      <input type="number" inputMode="numeric" value={it.amount || ''} onChange={(e) => setItems((a) => a.map((x, ix) => ix === i ? { ...x, amount: Number(e.target.value) || 0 } : x))} placeholder="0" className={`${inputCls} w-28 text-right`} />
                      <button onClick={() => setItems((a) => a.filter((_, ix) => ix !== i))} className="shrink-0 px-2 text-gray-300 hover:text-red-500 transition">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setItems((a) => [...a, { label: '', amount: 0 }])} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition">+ 항목</button>
                  <button onClick={saveSettings} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition disabled:opacity-40">
                    {savedOk ? '저장됐어요 ✓' : saving ? '저장 중...' : '고정비 저장'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ═══ 세금 ═══ */}
          {tab === 'tax' && taxEst && (
            <>
              <div className={`${card} mb-4`}>
                <p className="text-sm font-semibold text-[#3b2e21] mb-1">내 사업자 유형</p>
                <p className="text-xs text-gray-500 mb-4">모르겠으면 <strong>간이과세자</strong>일 확률이 높아요 (연매출 1억 400만원 미만).</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {([['simple', '간이과세자'], ['general', '일반과세자']] as const).map(([t, label]) => (
                    <button key={t} onClick={() => setTax((s) => ({ ...s, taxType: t }))}
                      className={`py-3 rounded-xl border text-sm font-medium transition ${
                        tax.taxType === t ? 'border-[#3b2e21] bg-[#3b2e21] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                      }`}>{label}</button>
                  ))}
                </div>
                {tax.taxType === 'simple' && (
                  <select value={tax.vatRate} onChange={(e) => setTax((s) => ({ ...s, vatRate: Number(e.target.value) }))} className={`${inputCls} w-full mb-4`}>
                    {VAT_RATE_OPTIONS.map((o) => <option key={o.rate} value={o.rate}>{o.label}</option>)}
                  </select>
                )}
                <button onClick={saveSettings} disabled={saving} className="w-full py-2.5 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition disabled:opacity-40">
                  {savedOk ? '저장됐어요 ✓' : '설정 저장'}
                </button>
              </div>

              <div className="rounded-2xl border border-[#e76f51]/30 bg-[#e76f51]/[0.05] p-6 mb-4">
                <p className="text-xs tracking-[0.2em] text-[#c2553a] uppercase mb-1">1년 세금 예상</p>
                <p className="text-xs text-gray-500 mb-5">
                  {taxEst.monthsCounted === 0
                    ? '아직 매출 데이터가 없어요.'
                    : taxEst.isProjected
                    ? `${taxEst.monthsCounted}개월 데이터를 1년치로 환산한 추정이에요.`
                    : '최근 12개월 기준이에요.'}
                </p>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-gray-600">1년 매출 (예상)</span>
                    <span className="font-bold text-[#3b2e21]">{manwon(taxEst.yearRevenue)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-gray-600">1년 순이익 (예상)</span>
                    <span className="font-bold text-[#3b2e21]">{manwon(taxEst.yearProfit)}</span>
                  </div>
                </div>

                <div className="border-t border-[#e76f51]/20 pt-4 space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm text-gray-600">부가가치세</span>
                      <span className="font-bold text-[#3b2e21]">{taxEst.vatExempt ? '면제 🎉' : won(taxEst.vat)}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{taxEst.vatNote}</p>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm text-gray-600">종합소득세 + 지방소득세</span>
                      <span className="font-bold text-[#3b2e21]">{won(taxEst.incomeTax + taxEst.localTax)}</span>
                    </div>
                    <p className="text-xs text-gray-400">순이익 기준 세율 {taxEst.incomeTaxRate}% 구간 · 지방소득세는 소득세의 10%</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#e76f51]/20">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[15px] font-bold text-[#3b2e21]">1년 세금 합계</span>
                    <span className="text-xl font-bold text-[#c2553a]">{won(taxEst.totalTax)}</span>
                  </div>
                  <p className="text-sm text-[#3b2e21]">
                    💡 매달 <strong>{won(taxEst.monthlyReserve)}</strong>씩 따로 빼두면 세금 낼 때 안 당황해요.
                  </p>
                </div>

                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  ⚠️ 공제·경비 인정 범위에 따라 실제 세액은 달라져요. 참고용 추정치이고, 실제 신고는 홈택스나 세무사와 확인하세요.
                </p>
              </div>

              <div className={`${card} mb-4`}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">언제 내나요</p>
                <div className="space-y-4">
                  {TAX_CALENDAR.map((t) => (
                    <div key={t.when} className="flex gap-4">
                      <span className="w-20 shrink-0 text-sm font-bold text-[#3b2e21]">{t.when}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-[#3b2e21]">{t.what}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.who}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={card}>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">이 말이 뭔가요</p>
                <div className="space-y-4">
                  {TERMS.map((t) => (
                    <div key={t.term}>
                      <p className="text-sm font-bold text-[#3b2e21]">
                        {t.term} <span className="font-normal text-gray-500">— {t.plain}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
