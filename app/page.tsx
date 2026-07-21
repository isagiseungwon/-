import Link from 'next/link'
import Header from './components/Header'
import SiteFooter from './components/SiteFooter'
import Reveal from './components/Reveal'
import InstaMarquee from './components/InstaMarquee'
import { PROGRAM } from '@/lib/program'
import { DAY_PASS } from '@/lib/types'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="text-[#1a1a2e]">
        {/* ───────── 브랜드 히어로 ───────── */}
        <section className="relative px-6 pt-20 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[#e9c46a]" />
            <div className="absolute -left-20 top-40 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#2a9d8f]" />
            <div className="absolute -right-16 top-24 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#e76f51]" />
          </div>
          <div className="relative max-w-xl mx-auto text-center">
            <Reveal>
              <div className="text-3xl mb-8">🌿</div>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-6">
                쌍문역 · 몰입 브랜드
              </p>
              <h1 className="serif text-[2.4rem] leading-[1.3] font-semibold tracking-tight mb-6">
                몰입, 흐름<br />그리고 나
              </h1>
              <p className="text-[15px] leading-[1.9] text-gray-500 mb-2">
                알림도, 시선도 없는 곳에서<br />
                온전히 나에게 집중하는 시간.
              </p>
              <p className="text-[15px] leading-[1.9] text-gray-500">
                혼자 머무는 <span className="text-[#1a1a2e]">공간</span>부터,<br />
                함께 해내는 <span className="text-[#1a1a2e]">4주 프로그램</span>까지.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 두 갈래 입구 카드 ───────── */}
        <section className="px-6 pb-8">
          <div className="max-w-xl mx-auto space-y-4">
            {/* 프로그램 카드 */}
            <Reveal>
              <Link
                href="/program"
                className="group block rounded-3xl border border-[#1a1a2e]/10 bg-[#12122a] text-white p-7 transition hover:border-[#1a1a2e]/30 hover:shadow-[0_16px_48px_rgba(18,18,42,0.25)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e76f51]/40 bg-[#e76f51]/[0.12] px-3 py-1 text-[11px] font-medium text-[#f4a58e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e76f51] animate-pulse" />
                    {PROGRAM.cohort} 모집 중 · {PROGRAM.seatsTotal}명 한정
                  </span>
                  <span className="text-white/40 text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="text-xs tracking-[0.15em] text-white/40 uppercase mb-2">Program</p>
                <h2 className="serif text-[1.7rem] font-semibold leading-tight tracking-tight mb-3">
                  요청을 현실로<br />만드는 4주
                </h2>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  혼자서는 못 버티니까, 같이. 주 1회 오프라인 세션 + 매일 단톡 인증으로 실행을 삶으로 잇는 소수 정원 프로그램.
                </p>
                <p className="text-sm">
                  <span className="text-white/40 line-through mr-2">
                    {PROGRAM.originalPrice.toLocaleString()}원
                  </span>
                  <span className="font-semibold text-white">
                    {PROGRAM.cohort} 한정 {PROGRAM.price.toLocaleString()}원
                  </span>
                </p>
              </Link>
            </Reveal>

            {/* 공간 카드 */}
            <Reveal delay={120}>
              <Link
                href="/space"
                className="group block rounded-3xl border border-gray-200 bg-white p-7 transition hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(26,26,46,0.10)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#f8f7f4] px-3 py-1 text-[11px] font-medium text-gray-500">
                    24시간 · 연중무휴
                  </span>
                  <span className="text-gray-300 text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Space</p>
                <h2 className="serif text-[1.7rem] font-semibold leading-tight tracking-tight mb-3">
                  24시간 몰입 공간
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  쌍문역 조용한 골목, 방해받지 않는 나만의 자리. 커피 한 잔 값으로 하루를 온전히 쓰는 공간 대여.
                </p>
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  {DAY_PASS.label} {DAY_PASS.price.toLocaleString()}원
                </p>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ───────── 브랜드 에세이 ───────── */}
        <section className="px-6 py-20">
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
                <p className="text-[15px] leading-[2] text-gray-600">
                  일기를 쓰든, 오늘의 생각을 적든,<br />
                  흩어진 아이디어를 정리하든, 책을 훑어보든 —<br />
                  <span className="text-[#1a1a2e]">
                    그 순간부터 시간은 느리고 여유롭게 흐릅니다.
                  </span>
                </p>
              </Reveal>

              <div className="max-w-[40px] mx-auto border-t border-gray-200" />

              <Reveal>
                <p className="text-[15px] leading-[2] text-gray-600">
                  오로지 한 호흡에 하나를 몰입할 수 있는,<br />
                  <span className="text-[#1a1a2e] font-medium">
                    누구도 값을 매길 수 없는 럭셔리한 시간.
                  </span>
                </p>
              </Reveal>
            </div>

            <Reveal>
              <blockquote className="mt-16 text-center">
                <p className="serif text-lg font-medium leading-relaxed tracking-tight text-[#1a1a2e]">
                  &ldquo;오늘, 내가 할 수 있는<br />의도적 몰입은 무엇인가?&rdquo;
                </p>
              </blockquote>
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
