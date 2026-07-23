'use client'

import { useEffect, useState, useCallback } from 'react'
import { Reservation, EntryKind } from '@/lib/types'
import { REPORT_TEMPLATES } from '@/lib/reportTemplates'

// 리드의 유형 요약(wish)에서 맞는 DM 템플릿을 찾는다
function templateForLead(r: Reservation) {
  if (!r.wish) return null
  return REPORT_TEMPLATES.find((t) => r.wish!.includes(t.title)) ?? null
}

// 멤버십 만료일 계산 (입금 확인일 + 30일)
function membershipExpiry(r: Reservation): { expiry: Date; dday: number } | null {
  if (r.kind !== 'membership' || r.status !== 'paid' || !r.paidAt) return null
  const expiry = new Date(new Date(r.paidAt).getTime() + 30 * 24 * 60 * 60 * 1000)
  const dday = Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  return { expiry, dday }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null) // null = 확인 중
  const [pw, setPw] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')
  const [kindFilter, setKindFilter] = useState<'all' | EntryKind>('all')
  const [copiedId, setCopiedId] = useState('')

  const loadReservations = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/reservations')
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    const data = await res.json()
    setReservations(data.reservations ?? [])
    setAuthed(true)
    setLoading(false)
  }, [])

  // 최초 진입 시 세션 확인
  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    setLoggingIn(false)
    if (!res.ok) {
      alert('비밀번호가 올바르지 않습니다.')
      return
    }
    setPw('')
    await loadReservations()
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setReservations([])
    setAuthed(false)
  }

  async function confirmDeposit(orderId: string, name: string) {
    if (!confirm(`${name}님 입금 확인하셨나요? 예약을 확정합니다.`)) return
    const res = await fetch('/api/admin/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    if (res.ok) {
      await loadReservations()
    } else {
      alert('처리 중 오류가 발생했습니다.')
    }
  }

  async function removeReservation(orderId: string, name: string) {
    if (!confirm(`${name}님 예약을 삭제할까요?\n삭제하면 되돌릴 수 없어요.`)) return
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    if (res.ok) {
      await loadReservations()
    } else {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  // 세션 확인 중
  if (authed === null) {
    return (
      <main className="flex items-center justify-center min-h-screen text-sm text-[#8f7e69]">
        불러오는 중...
      </main>
    )
  }

  // 로그인 필요
  if (!authed) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-[#332619] rounded-2xl border border-white/10 p-8 max-w-sm w-full">
          <h1 className="text-lg font-bold text-[#f0e7d7] mb-1">관리자 로그인</h1>
          <p className="text-xs text-[#8f7e69] mb-6">몰입, 흐름 그리고 나</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#e9c46a]/55"
            />
            <button
              type="submit"
              disabled={loggingIn || !pw}
              className="w-full py-3 rounded-xl bg-[#e9c46a] text-[#241a10] font-bold text-sm disabled:opacity-40"
            >
              {loggingIn ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  const filtered = reservations.filter((r) => {
    const statusOk = filter === 'all' || r.status === filter
    const kind = r.kind ?? 'space'
    const kindOk = kindFilter === 'all' || kind === kindFilter
    return statusOk && kindOk
  })

  async function copyLeadTemplate(r: Reservation) {
    const t = templateForLead(r)
    if (!t) return
    const body = t.body.replaceAll(
      '{이름}',
      r.name === '이름 미기재' ? '안녕하세요' : r.name
    )
    try {
      await navigator.clipboard.writeText(body)
      setCopiedId(r.orderId)
      setTimeout(() => setCopiedId(''), 2000)
    } catch {
      alert('복사에 실패했어요.')
    }
  }
  const totalRevenue = reservations
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0)
  const todayRevenue = reservations
    .filter((r) => r.status === 'paid' && r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.amount, 0)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#f0e7d7]">관리자 대시보드</h1>
          <p className="text-sm text-[#aa9a83] mt-0.5">몰입, 흐름 그리고 나</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/customers"
            className="text-sm px-3 py-1.5 rounded-full bg-[#7f8f5a] text-white font-medium hover:bg-[#6b7a48] transition"
          >
            🗂 고객 관리
          </a>
          <a
            href="/admin/blog"
            className="text-sm px-3 py-1.5 rounded-full bg-[#e9c46a] text-[#241a10] font-medium hover:bg-[#d9b45a] transition"
          >
            ✍️ 블로그 글 공장
          </a>
          <a
            href="/admin/templates"
            className="text-sm px-3 py-1.5 rounded-full border border-[#e9c46a]/55 text-[#f0e7d7] font-medium hover:bg-[#e9c46a] hover:text-[#241a10] transition"
          >
            📋 DM 템플릿
          </a>
          <a href="/" className="text-sm text-[#aa9a83] hover:text-[#e3d8c5]">← 예약 페이지</a>
          <button
            onClick={handleLogout}
            className="text-sm text-[#8f7e69] hover:text-[#d0c3ad] underline"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 매출 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#332619] rounded-2xl border border-white/10 p-5">
          <div className="text-xs text-[#8f7e69] mb-1">총 매출</div>
          <div className="text-xl font-bold text-[#f0e7d7]">{totalRevenue.toLocaleString()}원</div>
        </div>
        <div className="bg-[#332619] rounded-2xl border border-white/10 p-5">
          <div className="text-xs text-[#8f7e69] mb-1">오늘 매출</div>
          <div className="text-xl font-bold text-[#f0e7d7]">{todayRevenue.toLocaleString()}원</div>
        </div>
        <div className="bg-[#332619] rounded-2xl border border-white/10 p-5">
          <div className="text-xs text-[#8f7e69] mb-1">총 예약</div>
          <div className="text-xl font-bold text-[#f0e7d7]">
            {reservations.filter((r) => r.status === 'paid').length}건
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-2">
        {(['all', 'paid', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[#e9c46a] text-[#241a10]'
                : 'bg-[#332619] border border-white/15 text-[#d0c3ad] hover:border-white/25'
            }`}
          >
            {f === 'all' ? '전체' : f === 'paid' ? '결제완료' : '대기'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ['all', '🗂 전체'],
            ['space', '🕐 공간 예약'],
            ['program', '🪑 프로그램'],
            ['membership', '💳 멤버십'],
            ['gift', '🎁 선물권'],
            ['lead', '🧭 리드'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setKindFilter(k)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              kindFilter === k
                ? 'bg-[#7f8f5a] text-white'
                : 'bg-[#332619] border border-white/15 text-[#aa9a83] hover:border-white/25'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 예약 목록 */}
      {loading ? (
        <div className="text-center py-12 text-sm text-[#8f7e69]">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#8f7e69]">예약이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-[#332619] rounded-2xl border border-white/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#f0e7d7]">{r.name}</span>
                    {r.kind === 'program' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#7f8f5a]/10 text-[#7f8f5a] font-medium">
                        🪑 4주 프로그램
                      </span>
                    )}
                    {r.kind === 'lead' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e9c46a]/15 text-[#b8860b] font-medium">
                        🧭 테스트 리드
                      </span>
                    )}
                    {r.kind === 'membership' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        💳 멤버십
                      </span>
                    )}
                    {r.kind === 'gift' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">
                        🎁 선물권
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#aa9a83] mt-0.5">{r.phone}</div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    r.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {r.kind === 'lead'
                    ? '리드'
                    : r.status === 'paid'
                    ? r.kind === 'program'
                      ? '입금완료'
                      : '결제완료'
                    : '대기'}
                </span>
              </div>
              {r.kind === 'lead' ? (
                <div className="mt-3 space-y-1.5 text-xs text-[#aa9a83]">
                  <div className="flex flex-wrap gap-3">
                    <span>📅 {r.date}</span>
                    <span>📞 {r.phone}</span>
                  </div>
                  {r.wish && <div className="text-[#d0c3ad]">{r.wish}</div>}
                  {templateForLead(r) ? (
                    <button
                      onClick={() => copyLeadTemplate(r)}
                      className={`mt-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        copiedId === r.orderId
                          ? 'bg-green-600 text-white'
                          : 'bg-[#e9c46a] text-[#241a10] hover:bg-[#d9b45a]'
                      }`}
                    >
                      {copiedId === r.orderId
                        ? '복사됨 ✓ 이제 DM에 붙여넣으세요'
                        : '📋 맞춤 리포트 복사 (이름 자동 반영)'}
                    </button>
                  ) : (
                    <div className="text-[#b8860b]">→ 결과 리포트 DM/문자 보내기</div>
                  )}
                </div>
              ) : r.kind === 'program' || r.kind === 'membership' || r.kind === 'gift' ? (
                <div className="mt-3 space-y-1.5 text-xs text-[#aa9a83]">
                  <div className="flex flex-wrap gap-3">
                    <span>📅 신청 {r.date}</span>
                    <span className="font-medium text-[#f0e7d7]">💰 {r.amount.toLocaleString()}원</span>
                    {r.instagram && <span>📷 {r.instagram}</span>}
                  </div>
                  {r.wish && (
                    <div className="text-[#d0c3ad]">✍️ &ldquo;{r.wish}&rdquo;</div>
                  )}
                  {(() => {
                    const m = membershipExpiry(r)
                    if (!m) return null
                    const dateStr = m.expiry.toISOString().split('T')[0]
                    return (
                      <div
                        className={`font-medium ${
                          m.dday <= 0
                            ? 'text-red-500'
                            : m.dday <= 5
                            ? 'text-[#b8860b]'
                            : 'text-blue-600'
                        }`}
                      >
                        {m.dday <= 0
                          ? `⏰ 멤버십 만료됨 (${dateStr}) — 연장 안내 DM 추천`
                          : `⏰ 멤버십 ${dateStr}까지 · D-${m.dday}${
                              m.dday <= 5 ? ' — 곧 만료, 연장 안내 타이밍!' : ''
                            }`}
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#aa9a83]">
                  <span>📅 {r.date}</span>
                  <span>🕐 {r.time} 입실</span>
                  <span>⏱ {r.duration}시간권</span>
                  <span className="font-medium text-[#f0e7d7]">💰 {r.amount.toLocaleString()}원</span>
                  <span>{r.method === 'transfer' ? '🏦 계좌이체' : '💳 카드'}</span>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {r.status === 'pending' && r.method === 'transfer' && (
                  <button
                    onClick={() => confirmDeposit(r.orderId, r.name)}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                  >
                    {r.kind === 'program' || r.kind === 'membership' || r.kind === 'gift'
                      ? '✅ 입금 확인 → 확정'
                      : '✅ 입금 확인 → 예약 확정'}
                  </button>
                )}
                <button
                  onClick={() => removeReservation(r.orderId, r.name)}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
                >
                  🗑 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
