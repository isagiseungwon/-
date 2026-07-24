'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PROGRAM } from '@/lib/program'
import { DAY_PASS } from '@/lib/types'

type Phase = 'prep' | 'running' | 'done'

const DEFAULT_MINUTES = 10

// 1분마다 하나씩 넘어가는 몰입 명언 (10분 = 10개)
const QUOTES = [
  {
    text: '인간의 모든 불행은\n방에 혼자 조용히 앉아 있지 못하는 데서 온다.',
    by: '블레즈 파스칼',
  },
  {
    text: '최고의 순간은 어렵고 가치 있는 일을 해내려\n스스로를 한계까지 밀어붙일 때 찾아온다.',
    by: '미하이 칙센트미하이 · 『몰입 Flow』',
  },
  {
    text: '내가 가치 있는 발견을 했다면,\n다른 재능이 아니라 끈기 있는 집중 덕분이다.',
    by: '아이작 뉴턴',
  },
  {
    text: '집중이란 집중할 것에 예스라고 말하는 것이 아니다.\n다른 백 가지 좋은 아이디어에 노라고 말하는 것이다.',
    by: '스티브 잡스',
  },
  {
    text: '나는 특별히 똑똑한 것이 아니다.\n단지 문제를 더 오래 붙들고 있을 뿐이다.',
    by: '알베르트 아인슈타인',
  },
  {
    text: '성공의 비결을 한 단어로 적어달라는 질문에\n빌 게이츠와 워런 버핏은 같은 단어를 적었다. — 집중.',
    by: '빌 게이츠 & 워런 버핏',
  },
  {
    text: '만 가지 발차기를 한 번씩 연습한 사람은 두렵지 않다.\n한 가지를 만 번 연습한 사람이 두렵다.',
    by: '브루스 리',
  },
  {
    text: '우리에게 시간이 부족한 것이 아니라,\n우리가 시간을 낭비하는 것이다.',
    by: '세네카',
  },
  {
    text: '깊게 몰입하는 능력은 점점 희귀해지고 있다.\n그래서 점점 더 가치 있어진다.',
    by: '칼 뉴포트 · 『딥 워크』',
  },
  {
    text: '오늘, 내가 할 수 있는\n의도적 몰입은 무엇인가?',
    by: '몰입, 흐름 그리고 나',
  },
]

export default function FocusTimer() {
  const [phase, setPhase] = useState<Phase>('prep')
  const [task, setTask] = useState('')
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES)
  const [remaining, setRemaining] = useState(DEFAULT_MINUTES * 60)
  const endAt = useRef(0)
  const raf = useRef(0)
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null)

  // 테스트/유연성용 숨은 파라미터: /focus?m=5 → 5분
  useEffect(() => {
    const m = parseFloat(new URLSearchParams(window.location.search).get('m') || '')
    if (!Number.isNaN(m) && m > 0 && m <= 60) {
      setMinutes(m)
      setRemaining(Math.round(m * 60))
    }
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current)
      wakeLock.current?.release().catch(() => {})
    }
  }, [])

  async function start() {
    endAt.current = Date.now() + minutes * 60 * 1000
    setRemaining(Math.round(minutes * 60))
    setPhase('running')
    // 화면 꺼짐 방지 (지원 브라우저만)
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> }
      }
      if (nav.wakeLock) wakeLock.current = await nav.wakeLock.request('screen')
    } catch {
      // 미지원/거부 — 무시
    }
    const tick = () => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setPhase('done')
        wakeLock.current?.release().catch(() => {})
        return
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  function quit() {
    if (!confirm('여기서 멈출까요?\n지금까지의 시간도 충분히 의미 있어요.')) return
    cancelAnimationFrame(raf.current)
    wakeLock.current?.release().catch(() => {})
    setPhase('prep')
  }

  const durationLabel =
    minutes < 1 ? `${Math.round(minutes * 60)}초` : `${Math.round(minutes)}분`

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const total = Math.round(minutes * 60)
  const progress = total > 0 ? 1 - remaining / total : 0

  // ───────── 준비 ─────────
  if (phase === 'prep') {
    return (
      <div className="text-center">
        <div className="float-soft inline-block text-4xl mb-8">🕯️</div>
        <h1 className="serif text-[1.9rem] leading-[1.35] font-semibold tracking-tight mb-6">
          지금, {durationLabel}만<br />몰입해 볼까요?
        </h1>
        <div className="text-[15px] leading-[2] text-gray-500 mb-10 space-y-1">
          <p>1. 폰을 뒤집어 무음으로 두세요.</p>
          <p>2. 지금 할 것, 딱 하나만 정하세요.</p>
          <p>3. 시작을 누르면 — 한 호흡에 하나만.</p>
        </div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="지금 할 것 한 가지 (선택)"
          className="w-full max-w-xs mx-auto block rounded-xl border border-gray-200 bg-[#fdfaf4] px-4 py-3 text-sm text-center focus:outline-none focus:border-[#3b2e21] transition mb-3"
        />
        <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto mb-6">
          {['📖 독서', '✍️ 글쓰기', '📚 공부', '💻 업무', '🗓️ 계획'].map((ex) => {
            const label = ex.replace(/^[^ ]+ /, '')
            return (
              <button
                key={ex}
                type="button"
                onClick={() => setTask(label)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  task === label
                    ? 'border-[#3b2e21] bg-[#3b2e21] text-white'
                    : 'border-gray-200 bg-[#fdfaf4] text-gray-500 hover:border-gray-400'
                }`}
              >
                {ex}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={start}
          className="w-full max-w-xs mx-auto block py-4 rounded-full bg-[#3b2e21] text-white font-medium text-base hover:bg-[#4d3c2b] transition"
        >
          몰입 시작하기
        </button>
        <p className="text-xs text-gray-300 mt-5">
          화면이 꺼지지 않고, 1분마다 몰입 명언이 함께해요
        </p>
      </div>
    )
  }

  // ───────── 몰입 중 ─────────
  if (phase === 'running') {
    const R = 130
    const C = 2 * Math.PI * R
    const elapsed = total - remaining
    const quote = QUOTES[Math.floor(elapsed / 60) % QUOTES.length]
    return (
      <div className="text-center select-none">
        {task && (
          <p className="text-sm text-gray-400 mb-10 tracking-wide">
            지금은 <span className="text-[#3b2e21] font-medium">{task}</span> 에만
          </p>
        )}
        {!task && (
          <p className="text-sm text-gray-400 mb-10 tracking-wide">한 호흡에 하나만</p>
        )}
        <div className="relative w-[300px] h-[300px] mx-auto mb-12">
          <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90">
            <circle cx="150" cy="150" r={R} fill="none" stroke="#e8e6e1" strokeWidth="6" />
            <circle
              cx="150"
              cy="150"
              r={R}
              fill="none"
              stroke="#7f8f5a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="serif text-6xl font-semibold tracking-tight tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        </div>
        {/* 1분마다 넘어가는 몰입 명언 */}
        <div key={quote.by + quote.text} className="quote-fade max-w-sm mx-auto mb-10 min-h-[96px]">
          <p className="serif text-[15px] leading-[1.9] text-gray-600 whitespace-pre-line">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-xs text-gray-400 mt-3 tracking-wide">— {quote.by}</p>
        </div>

        <button
          type="button"
          onClick={quit}
          className="text-xs text-gray-300 hover:text-gray-500 underline underline-offset-4 transition"
        >
          멈추기
        </button>
      </div>
    )
  }

  // ───────── 완료 ─────────
  return (
    <div className="text-center">
      <div className="text-5xl mb-8">🪑</div>
      <h1 className="serif text-[1.8rem] leading-[1.4] font-semibold tracking-tight mb-6">
        방금, {durationLabel} 몰입에<br />성공하셨어요.
      </h1>
      <p className="text-[15px] leading-[2] text-gray-500 mb-4">
        방금 그 느낌 — 시간이 느리게 흐르고,<br />
        머리가 조용해지는 그 감각.
      </p>
      <p className="text-[15px] leading-[2] text-gray-600 mb-12">
        <span className="text-[#3b2e21] font-medium">그게 저희가 하는 일의 전부예요.</span>
        <br />
        이걸 매일, 더 깊게 만드는 것.
      </p>

      <div className="rounded-2xl bg-[#2b2119] text-white p-7 text-center mb-6 max-w-sm mx-auto">
        <p className="text-[15px] leading-[1.9] text-white/80 mb-6">
          집에서는 이 10분이 어려웠다면,<br />
          문제는 당신이 아니라 환경입니다.
        </p>
        <Link
          href="/space#booking"
          className="block w-full py-4 rounded-xl bg-[#fdfaf4] text-[#3b2e21] text-sm font-semibold hover:bg-gray-100 transition"
        >
          몰입이 설계된 공간 써보기 · {DAY_PASS.price.toLocaleString()}원
        </Link>
        <Link
          href="/program"
          className="inline-block mt-4 text-xs text-white/40 hover:text-white/70 underline underline-offset-4 transition"
        >
          매일 이어가고 싶다면, 4주 프로그램 {PROGRAM.cohort} →
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setPhase('prep')}
        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 transition"
      >
        한 번 더 하기
      </button>
    </div>
  )
}
