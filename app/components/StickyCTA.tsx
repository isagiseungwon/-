'use client'

import { useEffect, useState } from 'react'
import { PROGRAM } from '@/lib/program'
import { DAY_PASS } from '@/lib/types'

type Variant = 'program' | 'space'

/**
 * 하단 고정 CTA 바.
 * - 히어로를 지나 스크롤하면 나타남
 * - 대상 폼(#apply 또는 #booking)이 화면에 보이면 숨김 (버튼 중복 방지)
 */
export default function StickyCTA({ variant }: { variant: Variant }) {
  const [show, setShow] = useState(false)
  const [nearTarget, setNearTarget] = useState(false)

  const targetId = variant === 'program' ? 'apply' : 'booking'

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const target = document.getElementById(targetId)
    let obs: IntersectionObserver | null = null
    if (target) {
      obs = new IntersectionObserver(
        ([entry]) => setNearTarget(entry.isIntersecting),
        { threshold: 0.05 }
      )
      obs.observe(target)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs?.disconnect()
    }
  }, [targetId])

  const visible = show && !nearTarget

  const content =
    variant === 'program'
      ? {
          top: `4주 프로그램 ${PROGRAM.cohort} 모집 중`,
          price: `${PROGRAM.price.toLocaleString()}원`,
          sub: `${PROGRAM.seatsTotal}명 한정 · 선착순`,
          href: '#apply',
          cta: `${PROGRAM.cohort} 신청`,
        }
      : {
          top: DAY_PASS.label,
          price: `${DAY_PASS.price.toLocaleString()}원`,
          sub: '24시간 · 자유 출입',
          href: '#booking',
          cta: '예약하기',
        }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#160f08]/95 backdrop-blur px-5 py-3.5 shadow-[0_8px_32px_rgba(26,26,46,0.35)]">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/50 leading-tight">{content.top}</p>
            <p className="text-white font-semibold text-base leading-tight">
              {content.price}
              <span className="text-white/40 text-xs font-normal ml-2">
                {content.sub}
              </span>
            </p>
          </div>
          <a
            href={content.href}
            className="shrink-0 px-6 py-2.5 rounded-xl bg-[#e9c46a] text-[#241a10] text-sm font-semibold hover:bg-white/10 transition"
          >
            {content.cta}
          </a>
        </div>
      </div>
    </div>
  )
}
