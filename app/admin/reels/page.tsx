'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  FORMULA_STEPS,
  FormulaKey,
  PRE_CHECK,
  generateReelScript,
} from '@/lib/reels'
import type { ReelReference } from '@/lib/db'

type Tab = 'refs' | 'script'

export default function ReelsFactoryPage() {
  const [tab, setTab] = useState<Tab>('refs')
  const [authed, setAuthed] = useState<boolean | null>(null)

  // ── 레퍼런스 ──
  const [refs, setRefs] = useState<ReelReference[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [why, setWhy] = useState('')
  const [need, setNeed] = useState('')
  const [formula, setFormula] = useState<FormulaKey[]>([])
  const [saving, setSaving] = useState(false)

  // ── 대본 생성기 ──
  const [topic, setTopic] = useState('')
  const [known, setKnown] = useState('')
  const [listText, setListText] = useState('')
  const [ctaKeyword, setCtaKeyword] = useState('')
  const [give, setGive] = useState('')
  const [script, setScript] = useState('')
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/reels')
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    const data = await res.json()
    setRefs(data.refs ?? [])
    setAuthed(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function toggleFormula(k: FormulaKey) {
    setFormula((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]))
  }

  async function addRef() {
    if (!why.trim() || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, why, need, formula }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        alert(d.error ?? '저장에 실패했어요.')
        return
      }
      setUrl('')
      setWhy('')
      setNeed('')
      setFormula([])
      load()
    } finally {
      setSaving(false)
    }
  }

  async function removeRef(id: string) {
    if (!confirm('이 레퍼런스를 삭제할까요?')) return
    await fetch('/api/admin/reels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  function makeScript() {
    setScript(
      generateReelScript({
        topic,
        known,
        listItems: listText.split('\n'),
        ctaKeyword,
        give,
      })
    )
  }

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('복사에 실패했어요.')
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
    'w-full rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm focus:outline-none focus:border-[#3b2e21] transition'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#3b2e21]">🎬 릴스 공장</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            터진 릴스를 공식으로 뜯고, 그 공식으로 대본을 뽑아요
          </p>
        </div>
        <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          ← 대시보드
        </a>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-8">
        {(
          [
            ['refs', '📌 레퍼런스'],
            ['script', '✍️ 대본 생성기'],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === t
                ? 'bg-[#3b2e21] text-white'
                : 'bg-[#fdfaf4] border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ───────── 화면 1: 레퍼런스 ───────── */}
      {tab === 'refs' && (
        <>
          {/* 등록 폼 */}
          <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6 mb-8">
            <p className="text-sm font-semibold text-[#3b2e21] mb-4">
              터진 릴스 등록
            </p>
            <div className="space-y-3">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="인스타 릴스 링크 (선택)"
                className={inputCls}
              />
              <input
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="왜 먹혔나 한 줄 (필수)"
                className={inputCls}
              />
              <input
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                placeholder="건드린 결핍 (선택)"
                className={inputCls}
              />
            </div>
            <p className="text-xs text-gray-400 mt-4 mb-2">쓰인 공식 체크</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {FORMULA_STEPS.map((s) => {
                const on = formula.includes(s.key)
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleFormula(s.key)}
                    title={`${s.title} — ${s.desc}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      on
                        ? 'border-[#2a9d8f] bg-[#2a9d8f]/10 text-[#2a7d72] font-medium'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {on ? '✓ ' : ''}
                    {s.label}
                  </button>
                )
              })}
            </div>
            <button
              onClick={addRef}
              disabled={!why.trim() || saving}
              className="w-full py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition disabled:opacity-40"
            >
              {saving ? '저장 중...' : '레퍼런스 저장'}
            </button>
          </div>

          {/* 목록 */}
          {loading ? (
            <div className="text-center py-12 text-sm text-gray-400">불러오는 중...</div>
          ) : refs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fdfaf4] p-10 text-center text-sm text-gray-400">
              아직 등록한 레퍼런스가 없어요.
              <br />
              터진 릴스를 보면 "왜 먹혔나" 한 줄로 뜯어서 쌓아보세요.
            </div>
          ) : (
            <div className="space-y-3">
              {refs.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[#3b2e21] leading-snug">
                        {r.why}
                      </p>
                      {r.need && (
                        <p className="text-xs text-gray-500 mt-1">결핍: {r.need}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[#3b2e21]">
                      {r.formula.length}/4
                    </span>
                  </div>

                  {/* 공식 pill */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {FORMULA_STEPS.map((s) => {
                      const has = r.formula.includes(s.key)
                      return (
                        <span
                          key={s.key}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            has
                              ? 'bg-[#2a9d8f]/12 text-[#2a7d72]'
                              : 'bg-[#e76f51]/12 text-[#c2553a]'
                          }`}
                        >
                          {has ? s.label : `빠짐 · ${s.label}`}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-[#3b2e21] underline underline-offset-2"
                      >
                        ↗ 인스타에서 보기
                      </a>
                    )}
                    <button
                      onClick={() => removeRef(r.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition ml-auto"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ───────── 화면 2: 대본 생성기 ───────── */}
      {tab === 'script' && (
        <>
          <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6 mb-6 space-y-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="주제 (예: 몰입이 안 되는 이유)"
              className={inputCls}
            />
            <input
              value={known}
              onChange={(e) => setKnown(e.target.value)}
              placeholder='알지만 잊고 사는 사실 (예: "환경이 집중을 만든다")'
              className={inputCls}
            />
            <textarea
              value={listText}
              onChange={(e) => setListText(e.target.value)}
              rows={4}
              placeholder={'번호 리스트 항목 (줄바꿈으로 구분)\n폰을 다른 방에 두기\n할 일 딱 하나만 남기기\n장소로 약속하기'}
              className={`${inputCls} resize-none`}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={ctaKeyword}
                onChange={(e) => setCtaKeyword(e.target.value)}
                placeholder="CTA 키워드 (예: 몰입)"
                className={inputCls}
              />
              <input
                value={give}
                onChange={(e) => setGive(e.target.value)}
                placeholder="줄 것 (예: 몰입 체크리스트)"
                className={inputCls}
              />
            </div>
            <button
              onClick={makeScript}
              className="w-full py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition"
            >
              대본 생성하기
            </button>
          </div>

          {script && (
            <div>
              <div className="rounded-2xl border border-gray-100 bg-[#fdfaf4] p-1.5">
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={22}
                  className="w-full rounded-xl bg-transparent px-4 py-4 text-sm leading-[1.8] focus:outline-none resize-y text-[#3b2e21]"
                />
              </div>
              <button
                onClick={copyScript}
                className="w-full mt-3 py-3 rounded-xl bg-[#3b2e21] text-white text-sm font-semibold hover:bg-[#4d3c2b] transition"
              >
                {copied ? '복사됐어요 ✓' : '📋 대본 복사'}
              </button>
            </div>
          )}

          {/* 올리기 전 체크 (생성 전에도 상기용으로 노출) */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              올리기 전 체크
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              {PRE_CHECK.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-[#2a9d8f]">□</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </main>
  )
}
