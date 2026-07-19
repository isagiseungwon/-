'use client'

import { useState } from 'react'

const PRESET_KEYWORDS = [
  '쌍문역 스터디카페',
  '쌍문동 카공',
  '도봉구 조용한 카페',
  '24시간 스터디카페 서울',
  '혼자 생각 정리하기 좋은 곳',
  '일기 쓰기 좋은 공간',
]

export default function BlogFactoryPage() {
  const [keyword, setKeyword] = useState('')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState<'정보형' | '스토리형' | '후기형'>('정보형')
  const [photos, setPhotos] = useState('')
  const [extra, setExtra] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [mode, setMode] = useState('')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

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
        alert('관리자 로그인이 필요해요. 관리자 페이지에서 먼저 로그인해주세요.')
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

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">✍️ 블로그 글 공장</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            키워드와 주제만 넣으면 네이버 블로그 글이 완성돼요
          </p>
        </div>
        <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          ← 대시보드
        </a>
      </div>

      <div className="space-y-5 bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        {/* 키워드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            노릴 검색 키워드 *
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 쌍문역 스터디카페"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e]"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_KEYWORDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKeyword(k)}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* 주제 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            글 주제/방향 *
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={2}
            placeholder="예: 카페 소음에 지친 사람들에게 조용한 몰입 공간을 소개"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] resize-none"
          />
        </div>

        {/* 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">글 유형</label>
          <div className="grid grid-cols-3 gap-2">
            {(['정보형', '스토리형', '후기형'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  type === t
                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 사진 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            넣을 사진 설명 (한 줄에 하나씩)
          </label>
          <textarea
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
            rows={3}
            placeholder={'책상과 의자 사진\n야간 조명 켜진 책장\n골목길 입구'}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e] resize-none"
          />
        </div>

        {/* 추가 강조 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            추가로 강조할 내용 (선택)
          </label>
          <input
            type="text"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="예: 새벽 시간대 이용 추천"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1a1a2e]"
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#1a1a2e] text-white font-bold text-base disabled:opacity-40 hover:bg-[#2d2d4e] transition"
        >
          {loading ? '✍️ 글 쓰는 중... (최대 1분)' : '🚀 블로그 글 생성하기'}
        </button>
      </div>

      {/* 결과 */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-[#1a1a2e]">생성된 글</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {mode === 'ai' ? '🤖 AI 생성' : '📋 템플릿 생성'}
                {note && ` · ${note}`}
              </p>
            </div>
            <button
              onClick={copyResult}
              className="px-4 py-2 rounded-xl bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2d2d4e] transition"
            >
              {copied ? '✅ 복사됨!' : '📋 전체 복사'}
            </button>
          </div>
          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={24}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-[#1a1a2e]"
          />
          <p className="text-xs text-gray-400 mt-3">
            💡 수정할 부분 있으면 위에서 바로 고친 뒤 복사 → 네이버 블로그에 붙여넣고, [사진: ...] 자리에 실제 사진을 넣으세요!
          </p>
        </div>
      )}
    </main>
  )
}
