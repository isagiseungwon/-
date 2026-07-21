'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { QUIZ, QuizResult, resolveResult, MAX_SCORES, gaugeLevel } from '@/lib/quiz'
import { PROGRAM } from '@/lib/program'
import { DAY_PASS } from '@/lib/types'

type Phase = 'intro' | 'quiz' | 'analyzing' | 'result'

const ANALYZE_STEPS = [
  '응답 패턴을 살펴보는 중…',
  '몰입을 깨는 요인을 분류하는 중…',
  '당신의 몰입 유형을 찾는 중…',
]

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [scores, setScores] = useState({ env: 0, peer: 0 })
  const [shared, setShared] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  function start() {
    setPicks([])
    setIdx(0)
    setSelected(null)
    setResult(null)
    setPhase('quiz')
  }

  function pick(optionIdx: number) {
    if (selected !== null) return // 넘어가는 중 중복 클릭 방지
    setSelected(optionIdx)
    const nextPicks = [...picks, optionIdx]
    timers.current.push(
      setTimeout(() => {
        setSelected(null)
        if (nextPicks.length >= QUIZ.length) {
          setPicks(nextPicks)
          runAnalyze(nextPicks)
        } else {
          setPicks(nextPicks)
          setIdx(nextPicks.length)
        }
      }, 350)
    )
  }

  function goBack() {
    if (idx === 0) {
      setPhase('intro')
      return
    }
    setPicks(picks.slice(0, -1))
    setIdx(idx - 1)
    setSelected(null)
  }

  function runAnalyze(finalPicks: number[]) {
    setPhase('analyzing')
    setAnalyzeStep(0)
    ANALYZE_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setAnalyzeStep(i), i * 700))
    })
    timers.current.push(
      setTimeout(() => {
        let env = 0
        let peer = 0
        finalPicks.forEach((optIdx, qIdx) => {
          const opt = QUIZ[qIdx].options[optIdx]
          env += opt.env
          peer += opt.peer
        })
        setScores({ env, peer })
        setResult(resolveResult(env, peer))
        setPhase('result')
        window.scrollTo({ top: 0 })
      }, ANALYZE_STEPS.length * 700 + 600)
    )
  }

  async function share() {
    const url = `${window.location.origin}/test`
    const text = '나는 왜 몰입이 안 될까? 1분 만에 내 몰입 유형 알아보기 🧭'
    try {
      if (navigator.share) {
        await navigator.share({ title: '몰입 유형 테스트', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShared(true)
      timers.current.push(setTimeout(() => setShared(false), 2000))
    } catch {
      // 사용자가 공유 취소한 경우 등 — 무시
    }
  }

  // ───────── 인트로 ─────────
  if (phase === 'intro') {
    return (
      <div className="text-center">
        <div className="float-soft inline-block text-4xl mb-8">🧭</div>
        <h1 className="serif text-[1.9rem] leading-[1.35] font-semibold tracking-tight mb-5">
          나는 왜<br />몰입이 안 될까?
        </h1>
        <p className="text-[15px] leading-[1.9] text-gray-500 mb-3">
          같은 의지인데 누구는 되고, 누구는 안 됩니다.<br />
          차이는 의지가 아니라 <span className="text-[#1a1a2e] font-medium">유형</span>에 있어요.
        </p>
        <p className="text-sm leading-relaxed text-gray-400 mb-10">
          8개 질문, 약 1분.<br />
          내 몰입 유형과 그에 맞는 처방을 알려드립니다.
        </p>
        <button
          type="button"
          onClick={start}
          className="w-full max-w-xs mx-auto block py-4 rounded-full bg-[#1a1a2e] text-white font-medium text-base hover:bg-[#2d2d4e] transition"
        >
          테스트 시작하기
        </button>
        <p className="text-xs text-gray-300 mt-5">무료 · 로그인 없음 · 저장되지 않아요</p>
      </div>
    )
  }

  // ───────── 질문 ─────────
  if (phase === 'quiz') {
    const question = QUIZ[idx]
    const progress = (idx / QUIZ.length) * 100
    return (
      <div>
        {/* 진행 바 */}
        <div className="flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={goBack}
            aria-label="이전으로"
            className="shrink-0 w-8 h-8 rounded-full border border-gray-200 text-gray-400 text-sm hover:border-gray-400 hover:text-gray-600 transition"
          >
            ←
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-gray-200/70 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2a9d8f] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs text-gray-400 tabular-nums">
            {idx + 1} / {QUIZ.length}
          </span>
        </div>

        <h2 className="serif text-[1.45rem] leading-[1.5] font-semibold tracking-tight text-center whitespace-pre-line mb-10">
          {question.q}
        </h2>

        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => pick(i)}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-[15px] leading-relaxed transition-all ${
                selected === i
                  ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 active:scale-[0.99]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ───────── 분석 중 ─────────
  if (phase === 'analyzing') {
    return (
      <div className="text-center py-16">
        <div className="inline-block text-4xl mb-8 animate-pulse">🧭</div>
        <div className="space-y-3">
          {ANALYZE_STEPS.map((s, i) => (
            <p
              key={s}
              className={`text-sm transition-all duration-500 ${
                i <= analyzeStep ? 'text-[#1a1a2e] opacity-100' : 'opacity-25 text-gray-400'
              }`}
            >
              {i < analyzeStep ? '✓ ' : ''}
              {s}
            </p>
          ))}
        </div>
      </div>
    )
  }

  // ───────── 결과 ─────────
  if (!result) return null
  const primaryCta =
    result.cta === 'space'
      ? {
          href: '/space',
          label: `24시간 몰입 공간 써보기 · ${DAY_PASS.price.toLocaleString()}원`,
        }
      : {
          href: '/program',
          label: `4주 프로그램 ${PROGRAM.cohort} 알아보기`,
        }
  const secondaryCta =
    result.cta === 'space'
      ? { href: '/program', label: '4주 프로그램도 궁금하다면 →' }
      : { href: '/space', label: '공간만 먼저 경험해 보고 싶다면 →' }

  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-6">
          당신의 몰입 유형
        </p>
        <div className="text-5xl mb-5">{result.emoji}</div>
        <h1 className="serif text-[1.8rem] leading-tight font-semibold tracking-tight mb-3">
          {result.title}
        </h1>
        <p className="text-[15px] text-gray-500">{result.tagline}</p>
      </div>

      {/* 방해 지수 게이지 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-5">
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-5">
          몰입 방해 지수
        </p>
        {[
          {
            label: '환경 방해',
            desc: '소음·유혹·공간이 몰입을 깨는 정도',
            pct: Math.round((scores.env / MAX_SCORES.env) * 100),
            color: '#e76f51',
          },
          {
            label: '지속 방해',
            desc: '혼자서는 못 잇게 되는 정도',
            pct: Math.round((scores.peer / MAX_SCORES.peer) * 100),
            color: '#e9c46a',
          },
        ].map((g) => (
          <div key={g.label} className="mb-5 last:mb-0">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[15px] font-semibold">{g.label}</span>
              <span className="text-sm tabular-nums" style={{ color: g.color }}>
                {g.pct}% · {gaugeLevel(g.pct)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${g.pct}%`, backgroundColor: g.color }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{g.desc}</p>
          </div>
        ))}
      </div>

      {/* 진단 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-5">
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
          진단
        </p>
        <div className="space-y-4">
          {result.analysis.map((para) => (
            <p key={para.slice(0, 20)} className="text-[15px] leading-[1.9] text-gray-600">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* 처방 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-8">
        <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-5">
          오늘부터 해볼 것
        </p>
        <div className="space-y-5">
          {result.solutions.map((s, i) => (
            <div key={s.t} className="flex gap-4 items-start">
              <div className="serif shrink-0 w-7 h-7 rounded-full bg-[#2a9d8f]/10 text-[#2a9d8f] text-sm font-semibold flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold mb-1">{s.t}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 */}
      <div className="rounded-2xl bg-[#12122a] text-white p-7 text-center mb-6">
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-4">
          그리고, 한 가지 더
        </p>
        <p className="text-[15px] leading-[1.9] text-white/80 mb-6">{result.ctaReason}</p>
        {result.cta === 'program' && (
          <p className="text-xs text-[#e9c46a] mb-4 tracking-wide">
            {PROGRAM.cohort} {PROGRAM.seatsTotal}명 한정 · 현재 {PROGRAM.seatsLeft}자리 남음
          </p>
        )}
        <Link
          href={primaryCta.href}
          className="block w-full py-4 rounded-xl bg-white text-[#1a1a2e] text-sm font-semibold hover:bg-gray-100 transition"
        >
          {primaryCta.label}
        </Link>
        <Link
          href={secondaryCta.href}
          className="inline-block mt-4 text-xs text-white/40 hover:text-white/70 underline underline-offset-4 transition"
        >
          {secondaryCta.label}
        </Link>
      </div>

      <button
        type="button"
        onClick={share}
        className="block w-full max-w-xs mx-auto py-3.5 rounded-full border border-[#1a1a2e]/20 text-[#1a1a2e] text-sm font-medium hover:border-[#1a1a2e] transition mb-5"
      >
        {shared ? '링크가 복사됐어요 ✓' : '🧭 친구에게 테스트 공유하기'}
      </button>
      <button
        type="button"
        onClick={start}
        className="block mx-auto text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 transition"
      >
        테스트 다시 하기
      </button>
    </div>
  )
}
