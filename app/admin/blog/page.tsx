'use client'

import { useEffect, useRef, useState } from 'react'
import { checkBlogSeo } from '@/lib/blogGen'

const PRESET_KEYWORDS = [
  '쌍문역 스터디카페',
  '쌍문동 카공',
  '도봉구 조용한 카페',
  '24시간 스터디카페 서울',
  '혼자 생각 정리하기 좋은 곳',
  '일기 쓰기 좋은 공간',
]

// 바로 골라 쓰는 주제 뱅크 — 누르면 주제·유형이 자동으로 채워진다
const TOPIC_BANK = [
  { type: '정보형', label: '몰입 잘 되는 공간의 조건', topic: '몰입이 잘 되는 공간의 3가지 공통점을 운영자 시점에서 설명' },
  { type: '정보형', label: '작심삼일 극복법', topic: '작심삼일이 반복되는 진짜 이유(의지가 아니라 환경·동료의 부재)와 해결법 3가지' },
  { type: '정보형', label: '카페 공부 vs 스터디카페', topic: '카페 공부와 스터디카페의 장단점을 비교하고 조용한 몰입 공간의 차이를 소개' },
  { type: '정보형', label: '몰입 유형 테스트 소개', topic: '무료 1분 몰입 유형 테스트(hellkang.vercel.app/test)를 소개하고 4가지 유형별 특징 요약' },
  { type: '스토리형', label: '공간을 만든 이유', topic: '쌍문 조용한 골목에 몰입 공간을 만들게 된 이야기와 "시간을 비싸게 쓰는 법" 철학' },
  { type: '스토리형', label: '새벽의 몰입 공간', topic: '24시간 공간의 새벽 풍경과 그 시간에 오는 사람들의 이야기' },
  { type: '후기형', label: '24시간권 하루 체험기', topic: '24시간 이용권 4,500원으로 하루를 온전히 보낸 경험담' },
  { type: '후기형', label: '멤버십 한 달 루틴', topic: '월 49,000원 멤버십으로 매일 가는 루틴을 만든 변화 이야기' },
] as const

const REFINE_CHIPS = [
  '전체적으로 더 짧고 담백하게',
  '말투를 더 부드럽게',
  '문단을 더 잘게 나눠서 모바일에서 읽기 쉽게',
  '핵심 문장 볼드 강조를 2~3곳 추가',
  '해시태그를 더 다양하게',
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

interface TitleIdea {
  title: string
  topic: string
}

export default function BlogFactoryPage() {
  const [keyword, setKeyword] = useState('')
  const [title, setTitle] = useState('')
  const [titleIdeas, setTitleIdeas] = useState<TitleIdea[]>([])
  const [titlesLoading, setTitlesLoading] = useState(false)
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
  const [refineText, setRefineText] = useState('')
  const [refining, setRefining] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [draftsOpen, setDraftsOpen] = useState(false)
  const [drafts, setDrafts] = useState<
    { id: string; title: string; keyword: string; content: string; createdAt: string }[]
  >([])
  const [draftsLoading, setDraftsLoading] = useState(false)
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

  async function fetchTitles() {
    if (!keyword) {
      alert('먼저 키워드를 입력해주세요!')
      return
    }
    setTitlesLoading(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'titles', keyword }),
      })
      const data = await res.json()
      if (res.status === 401) {
        alert('관리자 로그인이 필요해요.')
        window.location.href = '/admin'
        return
      }
      if (!res.ok) {
        alert(data.error ?? '제목 생성 중 오류가 발생했습니다.')
        return
      }
      setTitleIdeas(data.titles ?? [])
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setTitlesLoading(false)
    }
  }

  function pickTitle(idea: TitleIdea) {
    setTitle(idea.title)
    setTopic(idea.topic)
  }

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
          title: title || undefined,
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

  async function refine(instruction?: string) {
    const inst = (instruction ?? refineText).trim()
    if (!inst || !result || refining) return
    setRefining(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refine', content: result, instruction: inst }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? '다듬기에 실패했어요.')
        return
      }
      setResult(data.content)
      setRefineText('')
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setRefining(false)
    }
  }

  async function saveDraft() {
    if (!result || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, content: result }),
      })
      if (!res.ok) {
        alert('저장에 실패했어요.')
        return
      }
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 2000)
      if (draftsOpen) loadDrafts()
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function loadDrafts() {
    setDraftsLoading(true)
    try {
      const res = await fetch('/api/admin/drafts')
      const data = await res.json()
      if (res.ok) setDrafts(data.drafts ?? [])
    } finally {
      setDraftsLoading(false)
    }
  }

  function toggleDrafts() {
    const next = !draftsOpen
    setDraftsOpen(next)
    if (next) loadDrafts()
  }

  async function removeDraft(id: string) {
    if (!confirm('이 초안을 삭제할까요?')) return
    await fetch('/api/admin/drafts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadDrafts()
  }

  function openDraft(d: { keyword: string; content: string }) {
    setResult(d.content)
    if (d.keyword) setKeyword(d.keyword)
    setMode('draft')
    setDraftsOpen(false)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
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
          <div className="shrink-0 flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={toggleDrafts}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                draftsOpen
                  ? 'border-[#e9c46a] text-[#e9c46a] bg-[#e9c46a]/10'
                  : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white/80'
              }`}
            >
              🗂 저장함
            </button>
            <a
              href="/admin"
              className="text-xs text-white/40 hover:text-white/70 transition"
            >
              ← 대시보드
            </a>
          </div>
        </div>

        {/* 저장함 */}
        {draftsOpen && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs text-white/40 mb-4">
              저장해 둔 초안 — 불러와서 이어서 다듬고 발행하세요
            </p>
            {draftsLoading ? (
              <p className="text-sm text-white/30 text-center py-4">불러오는 중...</p>
            ) : drafts.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">
                아직 저장된 초안이 없어요. 글 생성 후 💾 저장을 눌러보세요.
              </p>
            ) : (
              <div className="space-y-2">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/85 truncate">{d.title}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        {d.keyword && <span className="text-[#e9c46a]/70">{d.keyword} · </span>}
                        {new Date(d.createdAt).toLocaleDateString('ko-KR')} ·{' '}
                        {d.content.length.toLocaleString()}자
                      </p>
                    </div>
                    <button
                      onClick={() => openDraft(d)}
                      className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-white text-[#0f0f23] font-medium hover:bg-white/90 transition"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => removeDraft(d.id)}
                      className="shrink-0 text-xs px-2.5 py-1.5 rounded-full border border-red-400/30 text-red-300/80 hover:bg-red-400/10 transition"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

          {/* STEP 02 — 제목 짓기 */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-3">
                <span className="serif text-[#e9c46a] text-sm font-semibold">02</span>
                <h2 className="text-sm font-medium text-white/80">
                  제목 짓기 <span className="text-white/30 font-normal">(선택)</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={fetchTitles}
                disabled={titlesLoading}
                className="text-xs px-3.5 py-1.5 rounded-full border border-[#e9c46a]/50 text-[#e9c46a] hover:bg-[#e9c46a]/10 transition disabled:opacity-50"
              >
                {titlesLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-[#e9c46a]/40 border-t-[#e9c46a] animate-spin" />
                    뽑는 중...
                  </span>
                ) : (
                  '💡 제목 아이디어 8개 뽑기'
                )}
              </button>
            </div>

            {titleIdeas.length > 0 && (
              <div className="space-y-2 mb-3">
                {titleIdeas.map((idea) => (
                  <button
                    key={idea.title}
                    type="button"
                    onClick={() => pickTitle(idea)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      title === idea.title
                        ? 'border-[#e9c46a] bg-[#e9c46a]/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/30'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium leading-snug ${
                        title === idea.title ? 'text-[#e9c46a]' : 'text-white/85'
                      }`}
                    >
                      {idea.title}
                    </div>
                    <div className="text-[11px] text-white/35 mt-1 leading-snug">
                      {idea.topic}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="직접 입력하거나, 위에서 아이디어를 골라주세요"
              className={inputCls}
            />
          </section>

          {/* STEP 03 — 주제 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">03</span>
              <h2 className="text-sm font-medium text-white/80">글 주제 · 방향</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {TOPIC_BANK.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => {
                    setTopic(b.topic)
                    setType(b.type)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    topic === b.topic
                      ? 'border-[#2a9d8f] bg-[#2a9d8f]/15 text-[#7fd4c9]'
                      : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              placeholder="예: 카페 소음에 지친 사람들에게 조용한 몰입 공간을 소개 (위 주제 뱅크에서 골라도 돼요)"
              className={`${inputCls} resize-none`}
            />
          </section>

          {/* STEP 03 — 유형 */}
          <section>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="serif text-[#e9c46a] text-sm font-semibold">04</span>
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
              <span className="serif text-[#e9c46a] text-sm font-semibold">05</span>
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
              <span className="serif text-[#e9c46a] text-sm font-semibold">06</span>
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
                  {mode === 'ai' ? '🤖 AI 생성' : mode === 'draft' ? '🗂 저장 초안' : '📋 템플릿'}
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

            {/* 발행 전 SEO 점검 */}
            {keyword && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] tracking-[0.2em] text-[#e9c46a] uppercase mb-3">
                  발행 전 점검
                </p>
                <div className="space-y-2">
                  {checkBlogSeo(result, keyword).map((c) => (
                    <div key={c.label} className="flex items-start gap-2.5 text-sm">
                      <span className="shrink-0 mt-px">
                        {c.status === 'ok' ? '✅' : c.status === 'warn' ? '⚠️' : '❌'}
                      </span>
                      <span className="text-white/80 font-medium shrink-0">{c.label}</span>
                      <span className="text-white/40 text-xs mt-0.5">{c.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI 다듬기 */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[11px] tracking-[0.2em] text-[#e9c46a] uppercase mb-3">
                한 마디로 다듬기
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {REFINE_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => refine(c)}
                    disabled={refining}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:border-white/30 hover:text-white/80 transition disabled:opacity-40"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refineText}
                  onChange={(e) => setRefineText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && refine()}
                  placeholder="직접 지시하기 — 예: 서론을 질문으로 시작하게 바꿔줘"
                  className={inputCls}
                />
                <button
                  onClick={() => refine()}
                  disabled={refining || !refineText.trim()}
                  className="shrink-0 px-5 rounded-xl bg-[#e9c46a] text-[#0f0f23] text-sm font-semibold hover:bg-[#f0d084] transition disabled:opacity-40"
                >
                  {refining ? (
                    <span className="w-4 h-4 inline-block rounded-full border-2 border-[#0f0f23]/30 border-t-[#0f0f23] animate-spin" />
                  ) : (
                    '🪄'
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <button
                onClick={copyResult}
                className="py-3.5 rounded-xl bg-white text-[#0f0f23] text-sm font-semibold hover:bg-white/90 transition"
              >
                {copied ? '✅ 복사됨!' : '📋 복사'}
              </button>
              <button
                onClick={saveDraft}
                disabled={saving}
                className="py-3.5 rounded-xl border border-[#e9c46a]/50 text-[#e9c46a] text-sm font-medium hover:bg-[#e9c46a]/10 transition disabled:opacity-40"
              >
                {savedOk ? '✅ 저장됨!' : saving ? '저장 중...' : '💾 저장'}
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
