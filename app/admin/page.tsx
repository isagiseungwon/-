'use client'

import { useEffect, useState, useCallback } from 'react'
import { Reservation } from '@/lib/types'

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null) // null = 확인 중
  const [pw, setPw] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all')

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

  // 세션 확인 중
  if (authed === null) {
    return (
      <main className="flex items-center justify-center min-h-screen text-sm text-gray-400">
        불러오는 중...
      </main>
    )
  }

  // 로그인 필요
  if (!authed) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full">
          <h1 className="text-lg font-bold text-[#1a1a2e] mb-1">관리자 로그인</h1>
          <p className="text-xs text-gray-400 mb-6">몰입, 흐름 그리고 나</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e]"
            />
            <button
              type="submit"
              disabled={loggingIn || !pw}
              className="w-full py-3 rounded-xl bg-[#1a1a2e] text-white font-bold text-sm disabled:opacity-40"
            >
              {loggingIn ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  const filtered = reservations.filter((r) => filter === 'all' || r.status === filter)
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
          <h1 className="text-xl font-bold text-[#1a1a2e]">관리자 대시보드</h1>
          <p className="text-sm text-gray-500 mt-0.5">몰입, 흐름 그리고 나</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← 예약 페이지</a>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 매출 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-1">총 매출</div>
          <div className="text-xl font-bold text-[#1a1a2e]">{totalRevenue.toLocaleString()}원</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-1">오늘 매출</div>
          <div className="text-xl font-bold text-[#1a1a2e]">{todayRevenue.toLocaleString()}원</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-xs text-gray-400 mb-1">총 예약</div>
          <div className="text-xl font-bold text-[#1a1a2e]">
            {reservations.filter((r) => r.status === 'paid').length}건
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {(['all', 'paid', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[#1a1a2e] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {f === 'all' ? '전체' : f === 'paid' ? '결제완료' : '대기'}
          </button>
        ))}
      </div>

      {/* 예약 목록 */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">예약이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-[#1a1a2e]">{r.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{r.phone}</div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    r.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {r.status === 'paid' ? '결제완료' : '대기'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>📅 {r.date}</span>
                <span>🕐 {r.time} 입실</span>
                <span>⏱ {r.duration}시간권</span>
                <span className="font-medium text-[#1a1a2e]">💰 {r.amount.toLocaleString()}원</span>
                <span>{r.method === 'transfer' ? '🏦 계좌이체' : '💳 카드'}</span>
              </div>
              {r.status === 'pending' && r.method === 'transfer' && (
                <button
                  onClick={() => confirmDeposit(r.orderId, r.name)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                >
                  ✅ 입금 확인 → 예약 확정
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
