'use client'

import { useEffect, useRef, useState } from 'react'

const PRESET_KEYWORDS = [
  '쌍문역 스터디카페',
  '쌍문동 카공',
  '도봉구 조용한 카페',
  '24시간 스터디카페 서울',
  '혼자 생각 정리하기 좋은 곳',
  '일기 쓰기 좋은 공간',
]

const LOADING_STEPS = [
  '키워드 분석 중...',
  '상위노출 구조 잡는 중...',
  '공감 서론 쓰는 중...',
  '본문 소제목 구성 중...',
  '사진 자리 배치 중...',
  '해시태그 뽑는 중...',
  '문장 다듬는 중...',
]

export default function BlogFactoryPage() {
  const [keyword, setKeyword] = useState('')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState<'정보형' | '스토리형' | '후기형'>('정보형')
  const [photos, setPhotos] = useState('')
  const [extra, setExtra] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState('')
  const [mode, setMode] = useState('')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  // 생성 중 상태 메시지 순환
  useEffect(() => {
    if (!loading) return
    setLoadingStep(0)
    const t = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      2500
    )
    return () => clearInterval(t)
  }, [loading])

  async function generate() {
    if (!keyword || !topic) {
      alert('키워드와 주제를 입력해주세요!')
      return
    }
    setLoading(true)
    setResult('')
    setNote('')
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          topic,
          type,
          photos: photos.split('\n').map((s) => s.trim()).filter(Boolean),
          extra: extra || undefined,
        }),
      })
      const data = await res.json()
      if (res.status === 401) {
        alert('관리자 로그인이 필요해요. 먼저 로그인해주세요.')
        window.location.href = '/admin'
        return
      }
      if (!res.ok) {
        alert(data.error ?? '생성 중 오류가 발생했습니다.')
        return
      }
      setResult(data.content)
      setMode(data.mode)
      setNote(data.note ?? '')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#e9c46a]/60 focus:bg-white/[0.09] transition'

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* 배경 글로우 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.12] bg-[#e9c46a]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-3xl opacity-[0.10] bg-[#2a9d8f]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-[0.10] bg-[#e76f51]" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 py-10 pb-24">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-[#e9c46a] uppercase mb-2">
              Content Studio
            </p>
            <h1 className="serif text-2xl font-semibold tracking-tight">
              블로그 글 공장
            </h1>
            <p className="text-sm text-white/40 mt-1.5">
              키워드만 넣으면, 상위노출 구조의 글이 나옵니다
            </p>
          </div>
          <a
            href="/admin"
            className="shrink-0 text-xs text-white/40 hover:text-white/70 transition mt-1"
          >
            ← 대시보드
          </a>
        </div>

        <div className="space-y-8">
          {/* STEP 01 — 키워드 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">01</span>
              <h2 className="text-sm font-medium text-white/80">노릴 검색 키워드</h2>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 쌍문역 스터디카페"
              className={inputCls}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {PRESET_KEYWORDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKeyword(k)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    keyword === k
                      ? 'border-[#e9c46a] bg-[#e9c46a]/15 text-[#e9c46a]'
                      : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </section>

          {/* STEP 02 — 주제 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">02</span>
              <h2 className="text-sm font-medium text-white/80">글 주제 · 방향</h2>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              placeholder="예: 카페 소음에 지친 사람들에게 조용한 몰입 공간을 소개"
              className={`${inputCls} resize-none`}
            />
          </section>

          {/* STEP 03 — 유형 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">03</span>
              <h2 className="text-sm font-medium text-white/80">글 유형</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['정보형', '정보 전달 중심'],
                  ['스토리형', '이야기로 풀어냄'],
                  ['후기형', '방문 경험 시점'],
                ] as const
              ).map(([t, d]) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-3 px-2 rounded-xl border text-center transition ${
                    type === t
                      ? 'border-[#e9c46a] bg-[#e9c46a]/15'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/30'
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      type === t ? 'text-[#e9c46a]' : 'text-white/70'
                    }`}
                  >
                    {t}
                  </div>
                  <div className="text-[10px] text-white/30 mt-0.5">{d}</div>
                </button>
              ))}
            </div>
          </section>

          {/* STEP 04 — 사진 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">04</span>
              <h2 className="text-sm font-medium text-white/80">
                넣을 사진 <span className="text-white/30 font-normal">(한 줄에 하나씩 · 선택)</span>
              </h2>
            </div>
            <textarea
              value={photos}
              onChange={(e) => setPhotos(e.target.value)}
              rows={3}
              placeholder={'책상과 의자 사진\n야간 조명 켜진 책장\n골목길 입구'}
              className={`${inputCls} resize-none`}
            />
          </section>

          {/* STEP 05 — 추가 강조 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">05</span>
              <h2 className="text-sm font-medium text-white/80">
                추가 강조 <span className="text-white/30 font-normal">(선택)</span>
              </h2>
            </div>
            <input
              type="text"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="예: 새벽 시간대 이용 추천"
              className={inputCls}
            />
          </section>

          {/* 생성 버튼 */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-4.5 rounded-2xl font-semibold text-base text-[#0f0f23] transition disabled:opacity-70 py-4"
            style={{
              background: loading
                ? 'linear-gradient(90deg, #b08a3e, #e9c46a)'
                : 'linear-gradient(90deg, #e9c46a, #f4a261)',
              boxShadow: '0 8px 32px rgba(233, 196, 106, 0.25)',
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-[#0f0f23]/30 border-t-[#0f0f23] animate-spin" />
                {LOADING_STEPS[loadingStep]}
              </span>
            ) : (
              '✍️ 블로그 글 생성하기'
            )}
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div ref={resultRef} className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-[#e9c46a] uppercase mb-1">
                  Draft
                </p>
                <h2 className="serif text-lg font-semibold">완성된 초안</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-white/50">
                  {mode === 'ai' ? '🤖 AI 생성' : '📋 템플릿'}
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-white/50">
                  {result.length.toLocaleString()}자
                </span>
              </div>
            </div>

            {/* 원고지 카드 */}
            <div className="rounded-2xl bg-[#f8f7f4] text-[#1a1a2e] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={22}
                className="w-full rounded-xl bg-transparent px-4 py-4 text-sm leading-[1.9] focus:outline-none resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={copyResult}
                className="py-3.5 rounded-xl bg-white text-[#0f0f23] text-sm font-semibold hover:bg-white/90 transition"
              >
                {copied ? '✅ 복사됐어요!' : '📋 전체 복사'}
              </button>
              <button
                onClick={generate}
                disabled={loading}
                className="py-3.5 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 hover:text-white transition disabled:opacity-40"
              >
                🔄 다시 생성
              </button>
            </div>

            <p className="text-xs text-white/30 mt-4 leading-relaxed text-center">
              수정하고 복사 → 네이버 블로그에 붙여넣기 → [사진: ...] 자리에 실제 사진 넣고 발행!
              {note && <><br />{note}</>}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
