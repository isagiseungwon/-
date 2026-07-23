'use client'

import { useEffect, useRef } from 'react'

// 공간 사진 폴라로이드 마퀴:
// - 평소엔 자동으로 흐르고
// - 누르고 드래그하면 손으로 넘길 수 있음 (관성 포함, 놓으면 다시 자동)
const PHOTOS = [
  {
    src: '/story/gallery/sign-chair.jpg',
    cap: '몰입, 흐름 그리고 나',
    rot: '-rotate-2',
    glow: '0 12px 32px rgba(231, 111, 81, 0.35)',
  },
  {
    src: '/story/gallery/night-lamp.jpg',
    cap: '저녁의 조명',
    rot: 'rotate-2',
    glow: '0 12px 32px rgba(233, 196, 106, 0.45)',
  },
  {
    src: '/story/gallery/room-window.jpg',
    cap: '오후의 창가',
    rot: '-rotate-1',
    glow: '0 12px 32px rgba(42, 157, 143, 0.35)',
  },
  {
    src: '/story/gallery/alley.jpg',
    cap: '찾아오는 골목',
    rot: 'rotate-3',
    glow: '0 12px 32px rgba(69, 123, 157, 0.35)',
  },
  {
    src: '/story/gallery/desk-chair.jpg',
    cap: '여유 자리',
    rot: '-rotate-3',
    glow: '0 12px 32px rgba(188, 108, 37, 0.35)',
  },
  {
    src: '/story/gallery/desk-close.jpg',
    cap: '몰입 책상',
    rot: 'rotate-1',
    glow: '0 12px 32px rgba(204, 35, 102, 0.25)',
  },
]

const AUTO_SPEED = 100 // 자동 흐름 속도 (px/초)

export default function GalleryMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const s = {
      offset: 0,
      half: 0,
      dragging: false,
      lastX: 0,
      lastMoveT: 0,
      velocity: 0,
      raf: 0,
      lastT: 0,
    }

    const measure = () => {
      s.half = track.scrollWidth / 2
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    const tick = (t: number) => {
      const dt = s.lastT ? Math.min((t - s.lastT) / 1000, 0.05) : 0
      s.lastT = t
      if (!s.dragging && dt > 0) {
        s.offset -= AUTO_SPEED * dt // 기본 흐름 (왼쪽으로)
        if (Math.abs(s.velocity) > 30) {
          s.offset += s.velocity * dt // 드래그 관성
          s.velocity *= Math.pow(0.02, dt) // 부드럽게 감쇠
        } else {
          s.velocity = 0
        }
      }
      if (s.half > 0) {
        while (s.offset <= -s.half) s.offset += s.half
        while (s.offset > 0) s.offset -= s.half
      }
      track.style.transform = `translate3d(${s.offset}px,0,0)`
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)

    const down = (e: PointerEvent) => {
      s.dragging = true
      s.lastX = e.clientX
      s.lastMoveT = performance.now()
      s.velocity = 0
    }
    const move = (e: PointerEvent) => {
      if (!s.dragging) return
      const now = performance.now()
      const dx = e.clientX - s.lastX
      const dt = (now - s.lastMoveT) / 1000
      s.lastX = e.clientX
      s.lastMoveT = now
      s.offset += dx
      if (dt > 0) s.velocity = dx / dt // 놓는 순간 속도 기억
    }
    const up = () => {
      s.dragging = false
      // 과속 방지
      s.velocity = Math.max(-2500, Math.min(2500, s.velocity))
    }

    track.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      cancelAnimationFrame(s.raf)
      ro.disconnect()
      track.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const items = [...PHOTOS, ...PHOTOS]
  return (
    <div className="relative py-6">
      {/* 알록달록 배경 글로우 블롭 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-8 top-2 w-40 h-40 rounded-full blur-3xl opacity-50 bg-[#f4a261]" />
        <div className="absolute left-1/3 -top-6 w-44 h-44 rounded-full blur-3xl opacity-40 bg-[#e9c46a]" />
        <div className="absolute right-1/4 top-8 w-40 h-40 rounded-full blur-3xl opacity-40 bg-[#7f8f5a]" />
        <div className="absolute -right-8 -top-2 w-44 h-44 rounded-full blur-3xl opacity-35 bg-[#e76f51]" />
      </div>

      <div className="marquee-mask overflow-hidden relative">
        <div
          ref={trackRef}
          className="flex w-max py-4 cursor-grab active:cursor-grabbing select-none"
          style={{ willChange: 'transform', touchAction: 'pan-y' }}
        >
          {items.map((p, i) => (
            <figure
              key={`${p.src}-${i}`}
              className={`shrink-0 mr-5 bg-[#332619] p-2 pb-3 rounded-xl ${p.rot}`}
              style={{ boxShadow: p.glow }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.cap}
                loading="lazy"
                draggable={false}
                className="w-[150px] h-[190px] object-cover object-top rounded-lg block pointer-events-none"
              />
              <figcaption className="text-[11px] text-[#aa9a83] text-center mt-2 tracking-wide">
                {p.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
