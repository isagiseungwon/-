'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Customer, ActionItem, CustomerStage } from '@/lib/crm'
import { STAGE_META } from '@/lib/crm'
import { REPORT_TEMPLATES, OUTREACH_TEMPLATES } from '@/lib/reportTemplates'

interface Stats {
  total: number
  members: number
  regulars: number
  leads: number
  dormant: number
  revenue: number
}

function fillName(body: string, name: string) {
  return body.replaceAll('{이름}', name && name !== '이름 미기재' ? name : '안녕하세요')
}

// 액션에 맞는 DM 문안을 만든다
function dmForAction(a: ActionItem): string {
  if (a.templateKey === 'report') {
    const t = REPORT_TEMPLATES.find(
      (x) => a.customer.leadType && a.customer.leadType.includes(x.title)
    )
    if (t) return fillName(t.body, a.customer.name)
  }
  if (a.templateKey === 'revisit') return fillName(OUTREACH_TEMPLATES.revisit.body, a.customer.name)
  if (a.templateKey === 'member_extend')
    return fillName(OUTREACH_TEMPLATES.member_extend.body, a.customer.name)
  if (a.templateKey === 'winback') return fillName(OUTREACH_TEMPLATES.winback.body, a.customer.name)
  return ''
}

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000))
  if (d === 0) return '오늘'
  if (d === 1) return '어제'
  if (d < 30) return `${d}일 전`
  if (d < 365) return `${Math.floor(d / 30)}개월 전`
  return `${Math.floor(d / 365)}년 전`
}

export default function CustomersPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [actions, setActions] = useState<ActionItem[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [stageFilter, setStageFilter] = useState<'all' | CustomerStage>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState('')
  const [noteEdits, setNoteEdits] = useState<Record<string, string>>({})
  const [savingNote, setSavingNote] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/customers')
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    const data = await res.json()
    setCustomers(data.customers ?? [])
    setActions(data.actions ?? [])
    setStats(data.stats ?? null)
    setAuthed(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function copyDM(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    } catch {
      alert('복사에 실패했어요.')
    }
  }

  async function saveNote(phone: string) {
    setSavingNote(phone)
    try {
      await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, note: noteEdits[phone] ?? '' }),
      })
      setCustomers((cs) =>
        cs.map((c) => (c.phone === phone ? { ...c, note: noteEdits[phone] ?? '' } : c))
      )
    } finally {
      setSavingNote('')
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim()
    return customers.filter((c) => {
      const stageOk = stageFilter === 'all' || c.stage === stageFilter
      const qOk = !q || c.name.includes(q) || c.phone.includes(q)
      return stageOk && qOk
    })
  }, [customers, stageFilter, query])

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

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#3b2e21]">🗂 고객 관리</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            예약·리드·멤버십을 사람 단위로 모았어요
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
          {/* 통계 */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { label: '전체 고객', value: `${stats.total}명` },
                { label: '멤버', value: `${stats.members}명` },
                { label: '단골', value: `${stats.regulars}명` },
                { label: '누적 매출', value: `${(stats.revenue / 10000).toFixed(0)}만` },
              ].map((s) => (
                <div key={s.label} className="bg-[#fdfaf4] rounded-2xl border border-gray-100 p-4">
                  <div className="text-[11px] text-gray-400 mb-1">{s.label}</div>
                  <div className="text-lg font-bold text-[#3b2e21]">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 오늘 할 일 */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-[#3b2e21]">☀️ 오늘 챙길 사람</h2>
              <span className="text-xs text-gray-400">{actions.length}건</span>
            </div>
            {actions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fdfaf4] p-6 text-center text-sm text-gray-400">
                지금 급히 챙길 고객은 없어요. 잘하고 계세요 🌿
              </div>
            ) : (
              <div className="space-y-2.5">
                {actions.map((a, i) => {
                  const key = `act_${i}`
                  const dm = dmForAction(a)
                  return (
                    <div
                      key={key}
                      className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-4 flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{a.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#3b2e21]">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {a.reason}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          {dm && (
                            <button
                              onClick={() => copyDM(key, dm)}
                              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                                copiedKey === key
                                  ? 'bg-green-600 text-white'
                                  : 'bg-[#3b2e21] text-white hover:bg-[#4d3c2b]'
                              }`}
                            >
                              {copiedKey === key ? '복사됨 ✓ 붙여넣으세요' : '📋 DM 문안 복사'}
                            </button>
                          )}
                          <a
                            href={`sms:${a.customer.phone}`}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition"
                          >
                            {a.customer.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* 필터 + 검색 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(
              [
                ['all', '전체'],
                ['lead', '🧭 리드'],
                ['new', '🌱 신규'],
                ['regular', '🪑 단골'],
                ['member', '💳 멤버'],
                ['dormant', '😴 휴면'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setStageFilter(k)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  stageFilter === k
                    ? 'bg-[#3b2e21] text-white'
                    : 'bg-[#fdfaf4] border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름·번호 검색"
              className="ml-auto rounded-full border border-gray-200 bg-[#fdfaf4] px-4 py-1.5 text-xs w-36 focus:outline-none focus:border-[#3b2e21]"
            />
          </div>

          {/* 고객 목록 */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">고객이 없어요.</div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((c) => {
                const meta = STAGE_META[c.stage]
                const open = expanded === c.phone
                return (
                  <div key={c.phone} className="bg-[#fdfaf4] rounded-2xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpanded(open ? null : c.phone)}
                      className="w-full text-left p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[#3b2e21]">{c.name}</span>
                            <span
                              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                            >
                              {meta.emoji} {meta.label}
                            </span>
                            {c.isMember && c.memberDday !== null && (
                              <span className="text-[11px] text-blue-600 font-medium">
                                멤버십 D-{c.memberDday}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{c.phone}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold text-[#3b2e21]">
                            {c.totalSpent.toLocaleString()}원
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            방문 {c.visitCount}회 · {timeAgo(c.lastActivity)}
                          </div>
                        </div>
                      </div>
                      {c.leadType && (
                        <div className="text-[11px] text-gray-400 mt-2">유형: {c.leadType}</div>
                      )}
                      {c.note && !open && (
                        <div className="text-xs text-gray-500 mt-2 truncate">📝 {c.note}</div>
                      )}
                    </button>

                    {open && (
                      <div className="px-5 pb-5 -mt-1 space-y-4">
                        {/* 타임라인 */}
                        <div>
                          <p className="text-[11px] tracking-wide text-gray-400 uppercase mb-2">
                            여정
                          </p>
                          <ul className="space-y-1.5">
                            {c.events.map((e, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    e.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                />
                                <span className="text-gray-400 tabular-nums">{e.date}</span>
                                <span className="text-gray-600">{e.label}</span>
                                {e.amount > 0 && (
                                  <span className="text-gray-400">
                                    · {e.amount.toLocaleString()}원
                                  </span>
                                )}
                                {e.status === 'paid' && (
                                  <span className="text-green-600">✓</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 메모 */}
                        <div>
                          <p className="text-[11px] tracking-wide text-gray-400 uppercase mb-2">
                            메모
                          </p>
                          <textarea
                            value={noteEdits[c.phone] ?? c.note}
                            onChange={(e) =>
                              setNoteEdits((m) => ({ ...m, [c.phone]: e.target.value }))
                            }
                            rows={2}
                            placeholder="예: 새벽에 오심, 창가 자리 선호"
                            className="w-full rounded-xl border border-gray-200 bg-[#f3ece1] px-3 py-2 text-sm focus:outline-none focus:border-[#3b2e21] resize-none"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => saveNote(c.phone)}
                              disabled={savingNote === c.phone}
                              className="text-xs px-3 py-1.5 rounded-full bg-[#3b2e21] text-white font-medium hover:bg-[#4d3c2b] transition disabled:opacity-40"
                            >
                              {savingNote === c.phone ? '저장 중...' : '메모 저장'}
                            </button>
                            <a
                              href={`sms:${c.phone}`}
                              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition"
                            >
                              💬 문자
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </main>
  )
}
