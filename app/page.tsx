import Link from 'next/link'
import Header from './components/Header'
import SiteFooter from './components/SiteFooter'
import Reveal from './components/Reveal'
import InstaMarquee from './components/InstaMarquee'
import GalleryMarquee from './components/GalleryMarquee'
import { PROGRAM } from '@/lib/program'
import { DAY_PASS } from '@/lib/types'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="text-[#1a1a2e]">
        {/* ───────── 브랜드 히어로 ───────── */}
        <section className="relative px-6 pt-20 pb-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="glow-breathe absolute left-1/2 -translate-x-1/2 -top-24 w-80 h-80 rounded-full blur-3xl bg-[#e9c46a]" />
            <div className="glow-breathe-delay absolute -left-20 top-40 w-60 h-60 rounded-full blur-3xl bg-[#2a9d8f]" />
            <div className="glow-breathe absolute -right-16 top-24 w-60 h-60 rounded-full blur-3xl bg-[#e76f51]" />
          </div>
          <div className="relative max-w-xl mx-auto text-center">
            <Reveal>
              <div className="float-soft inline-block text-3xl mb-8">🪑</div>
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-6">
                쌍문역 · 몰입 브랜드
              </p>
              <h1 className="serif text-[2.6rem] leading-[1.28] font-semibold tracking-tight mb-7">
                몰입, 흐름<br />그리고 나
              </h1>
              <p className="text-[15px] leading-[1.95] text-gray-500 mb-2">
                알림도, 시선도 없는 곳에서<br />
                온전히 나에게 집중하는 시간.
              </p>
              <p className="text-[15px] leading-[1.95] text-gray-500">
                혼자 머무는 <span className="text-[#1a1a2e] font-medium">공간</span>부터,<br />
                함께 해내는 <span className="text-[#1a1a2e] font-medium">4주 프로그램</span>까지.
              </p>
              <div className="mt-10 flex items-center justify-center gap-1.5 text-gray-300" aria-hidden>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="w-1 h-1 rounded-full bg-current" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 두 갈래 입구: 사진 카드 ───────── */}
        <section className="px-5 pb-10">
          <div className="max-w-xl mx-auto space-y-5">
            {/* 프로그램 카드 */}
            <Reveal>
              <Link
                href="/program"
                className="group block rounded-[28px] overflow-hidden bg-[#12122a] text-white shadow-[0_16px_48px_rgba(18,18,42,0.28)] transition-all duration-300 hover:shadow-[0_24px_64px_rgba(18,18,42,0.4)] hover:-translate-y-0.5"
              >
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/story/gallery/night-lamp.jpg"
                    alt="저녁의 몰입 공간"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12122a] via-[#12122a]/30 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-[#e76f51]/50 bg-[#12122a]/70 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-[#f4a58e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e76f51] animate-pulse" />
                    {PROGRAM.cohort} 모집 중 · {PROGRAM.seatsTotal}명 한정
                  </span>
                </div>
                <div className="px-7 pb-7 -mt-6 relative">
                  <p className="text-[11px] tracking-[0.18em] text-white/40 uppercase mb-2">
                    Program
                  </p>
                  <h2 className="serif text-[1.65rem] font-semibold leading-tight tracking-tight mb-3">
                    요청을 현실로<br />만드는 4주
                  </h2>
                  <p className="text-sm text-white/55 leading-relaxed mb-5">
                    혼자서는 못 버티니까, 같이. 주 1회 마차 운영자의 밀도 높은
                    강의와 매일의 실행 인증으로 미루던 것을 해내는 소수 정원 프로그램.
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="text-white/35 line-through mr-2">
                        {PROGRAM.originalPrice.toLocaleString()}원
                      </span>
                      <span className="font-semibold text-[#e9c46a]">
                        {PROGRAM.price.toLocaleString()}원
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all group-hover:text-white group-hover:gap-2.5">
                      자세히 보기 <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* 공간 카드 */}
            <Reveal delay={120}>
              <Link
                href="/space"
                className="group block rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-[0_12px_40px_rgba(26,26,46,0.08)] transition-all duration-300 hover:shadow-[0_20px_56px_rgba(26,26,46,0.14)] hover:-translate-y-0.5"
              >
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/story/gallery/room-window.jpg"
                    alt="오후의 창가, 몰입 공간"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-gray-600">
                    🕐 24시간 · 연중무휴
                  </span>
                </div>
                <div className="px-7 pb-7 -mt-6 relative">
                  <p className="text-[11px] tracking-[0.18em] text-gray-400 uppercase mb-2">
                    Space
                  </p>
                  <h2 className="serif text-[1.65rem] font-semibold leading-tight tracking-tight mb-3">
                    24시간 몰입 공간
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    쌍문역 조용한 골목, 방해받지 않는 나만의 자리.
                    커피 한 잔 값으로 하루를 온전히 쓰는 공간.
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#1a1a2e]">
                      {DAY_PASS.label} {DAY_PASS.price.toLocaleString()}원
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-all group-hover:text-[#1a1a2e] group-hover:gap-2.5">
                      자세히 보기 <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ───────── 공간의 순간들: 폴라로이드 마퀴 ───────── */}
        <section className="py-16 overflow-hidden">
          <div className="max-w-xl mx-auto text-center px-6 mb-2">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
                Moments
              </p>
            </Reveal>
          </div>
          <Reveal>
            <GalleryMarquee />
          </Reveal>
          <div className="max-w-xl mx-auto text-center px-6 mt-2">
            <Reveal>
              <p className="text-sm text-gray-400">
                쌍문역 3번 출구 도보 8분, 조용한 골목에 있습니다
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 브랜드 에세이 ───────── */}
        <section className="px-6 py-20 bg-white border-y border-gray-100">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Essay
              </p>
              <h2 className="serif text-xl font-medium text-center mb-14 tracking-tight">
                시간을 비싸게 쓰는 법
              </h2>
            </Reveal>

            <div className="space-y-14 text-center">
              <Reveal>
                <p className="text-[15px] leading-[2.05] text-gray-600">
                  일기를 쓰든, 오늘의 생각을 적든,<br />
                  흩어진 아이디어를 정리하든, 책을 훑어보든 —<br />
                  <span className="text-[#1a1a2e]">
                    그 순간부터 시간은 느리고 여유롭게 흐릅니다.
                  </span>
                </p>
              </Reveal>

              <div className="max-w-[40px] mx-auto border-t border-gray-200" />

              <Reveal>
                <p className="text-[15px] leading-[2.05] text-gray-600">
                  오로지 한 호흡에 하나를 몰입할 수 있는,<br />
                  <span className="text-[#1a1a2e] font-medium">
                    누구도 값을 매길 수 없는 럭셔리한 시간.
                  </span>
                </p>
              </Reveal>
            </div>

            <Reveal>
              <blockquote className="mt-16 mx-auto max-w-md rounded-2xl bg-[#f8f7f4] border border-gray-100 px-8 py-10 text-center relative">
                <span className="serif absolute top-4 left-6 text-4xl text-[#e9c46a] leading-none" aria-hidden>
                  &ldquo;
                </span>
                <p className="serif text-lg font-medium leading-relaxed tracking-tight text-[#1a1a2e]">
                  오늘, 내가 할 수 있는<br />의도적 몰입은 무엇인가?
                </p>
              </blockquote>
            </Reveal>

            <Reveal>
              <div className="mt-12 grid grid-cols-2 gap-3 max-w-md mx-auto">
                <Link
                  href="/program"
                  className="py-3.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-medium text-center hover:bg-[#2d2d4e] transition"
                >
                  4주 프로그램 →
                </Link>
                <Link
                  href="/space"
                  className="py-3.5 rounded-xl border border-[#1a1a2e]/20 text-[#1a1a2e] text-sm font-medium text-center hover:border-[#1a1a2e] transition"
                >
                  공간 이용하기 →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 인스타그램 ───────── */}
        <section className="py-20 bg-[#12122a] text-white overflow-hidden">
          <div className="px-6 max-w-md mx-auto text-center mb-10">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-6">
                Instagram
              </p>
              <h2 className="serif text-xl font-medium tracking-tight mb-4 leading-relaxed">
                이 공간의 이야기를<br />
                함께 보고 있습니다
              </h2>
              <p className="text-sm text-white/50">@macha_ver._ · 이상한 마차</p>
            </Reveal>
          </div>

          <Reveal>
            <InstaMarquee />
          </Reveal>

          <div className="text-center mt-10 px-6">
            <Reveal>
              <p className="text-xs text-white/40 mb-6">
                카드를 누르면 인스타그램으로 이동해요
              </p>
              <a
                href="https://www.instagram.com/macha_ver._"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3.5 rounded-full text-sm font-medium text-white transition hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
              >
                📷 인스타그램 보러가기
              </a>
            </Reveal>
          </div>
        </section>

        {/* ───────── 유튜브 ───────── */}
        <section className="px-6 py-20">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                Video
              </p>
              <h2 className="serif text-xl font-medium tracking-tight mb-4">
                마차가 더 궁금하다면
              </h2>
              <p className="text-sm text-gray-500 mb-10">
                이 공간을 만든 사람의 이야기를 영상으로 만나보세요
              </p>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-[0_12px_40px_rgba(26,26,46,0.15)]">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Kur0FCStKLo"
                  title="몰입, 흐름 그리고 나 — 마차 이야기"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  )
}
