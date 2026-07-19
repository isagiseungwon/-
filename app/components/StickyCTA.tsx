'use client'

import { useEffect, useState } from 'react'
import { DAY_PASS } from '@/lib/types'

/**
 * 하단 고정 예약 바.
 * - 히어로를 지나 스크롤하면 나타남
 * - 예약 폼(#booking)이 화면에 보이면 숨김 (버튼 중복 방지)
 */
export default function StickyCTA() {
  const [show, setShow] = useState(false)
  const [nearBooking, setNearBooking] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const booking = document.getElementById('booking')
    let obs: IntersectionObserver | null = null
    if (booking) {
      obs = new IntersectionObserver(
        ([entry]) => setNearBooking(entry.isIntersecting),
        { threshold: 0.05 }
      )
      obs.observe(booking)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs?.disconnect()
    }
  }, [])

  const visible = show && !nearBooking

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur px-5 py-3.5 shadow-[0_8px_32px_rgba(26,26,46,0.35)]">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/50 leading-tight">{DAY_PASS.label}</p>
            <p className="text-white font-semibold text-base leading-tight">
              {DAY_PASS.price.toLocaleString()}원
              <span className="text-white/40 text-xs font-normal ml-2">
                24시간 · 음료 무료
              </span>
            </p>
          </div>
          <a
            href="#booking"
            className="shrink-0 px-6 py-2.5 rounded-xl bg-white text-[#1a1a2e] text-sm font-semibold hover:bg-gray-100 transition"
          >
            예약하기
          </a>
        </div>
      </div>
    </div>
  )
}
