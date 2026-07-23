import Link from 'next/link'
import Header from './components/Header'
import SiteFooter from './components/SiteFooter'
import Reveal from './components/Reveal'
import InstaMarquee from './components/InstaMarquee'
import InstaIcon from './components/InstaIcon'
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
              <div className="mt-10 flex flex-col items-center gap-3">
                <Link
                  href="/test"
                  className="inline-flex items-center justify-center gap-2 w-full max-w-[300px] py-4 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2d2d4e] transition shadow-[0_8px_28px_rgba(26,26,46,0.25)]"
                >
                  🧭 나는 왜 몰입이 안 될까?
                </Link>
                <Link
                  href="/focus"
                  className="inline-flex items-center justify-center gap-2 w-full max-w-[300px] py-4 rounded-full border border-[#1a1a2e]/25 bg-white/60 backdrop-blur text-[#1a1a2e] text-sm font-medium hover:border-[#1a1a2e] transition"
                >
                  🕯️ 지금 10분 몰입해 보기
                </Link>
                <p className="text-xs text-gray-400 mt-1 tracking-wide">
                  둘 다 무료 · 1분 테스트, 10분 체험
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 두 갈래 입구: 사진 카드 ───────── */}
        <section className="px-5 pb-10">
          <div className="max-w-xl mx-auto space-y-5">
            {/* 공간 카드 */}
            <Reveal>
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
                      {DAY_PASS.price.toLocaleString()}원
                      <span className="text-gray-400 font-normal text-xs ml-2">
                        · 월 무제한 49,000원
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-all group-hover:text-[#1a1a2e] group-hover:gap-2.5">
                      자세히 보기 <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* 프로그램 카드 */}
            <Reveal delay={120}>
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

            {/* 몰입 테스트 티저 */}
            <Reveal delay={200}>
              <Link
                href="/test"
                className="group block rounded-[28px] border border-[#2a9d8f]/25 bg-[#2a9d8f]/[0.05] p-7 transition-all duration-300 hover:border-[#2a9d8f]/50 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <span className="text-3xl">🧭</span>
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-[#2a9d8f] uppercase mb-1.5 font-semibold">
                        1분 무료 테스트
                      </p>
                      <h2 className="serif text-lg font-semibold tracking-tight leading-snug mb-1">
                        나는 왜 몰입이 안 될까?
                      </h2>
                      <p className="text-xs text-gray-500">
                        8개 질문으로 내 몰입 유형과 처방 받기
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[#2a9d8f] text-sm transition-transform group-hover:translate-x-1">→</span>
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

        {/* ───────── 브랜드 에세이: 마차의 기록 ───────── */}
        <section className="px-6 py-20 bg-white border-y border-gray-100 overflow-hidden">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Essay
              </p>
              <h2 className="serif text-xl font-medium text-center mb-4 tracking-tight">
                시간을 비싸게 쓰는 법
              </h2>
              <p className="text-xs text-gray-400 text-center mb-12">
                운영자 마차가 직접 쓴 기록
              </p>
            </Reveal>

            {/* 마차의 실제 손글씨 카드 */}
            <Reveal>
              <figure className="mx-auto max-w-[280px] -rotate-2 bg-white p-2.5 pb-4 rounded-xl shadow-[0_16px_40px_rgba(233,196,106,0.35)] mb-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/story/insta/expensive.jpg"
                  alt="시간을 비싸게 쓰는 법 — 마차의 손글씨 기록"
                  loading="lazy"
                  className="w-full rounded-lg block"
                />
                <figcaption className="text-[11px] text-gray-400 text-center mt-2.5 tracking-wide">
                  @macha_ver._ 의 기록에서
                </figcaption>
              </figure>
            </Reveal>

            <div className="space-y-12 text-center mb-14">
              <Reveal>
                <p className="text-[15px] leading-[2.05] text-gray-600">
                  일기를 쓰든, 오늘의 생각을 적든,<br />
                  흩어진 아이디어를 적든, 책을 훑어보든 —<br />
                  <span className="text-[#1a1a2e]">
                    어쨌든 그 순간부터 나의 시간은 느리게, 여유롭게 흘러갑니다.
                  </span>
                </p>
              </Reveal>
              <Reveal>
                <p className="text-[15px] leading-[2.05] text-gray-600">
                  오로지 한 호흡에 하나를 몰입할 수 있는,<br />
                  <span className="text-[#1a1a2e] font-medium">
                    최고의 럭셔리 시간을 누릴 수 있다는 것.
                  </span>
                </p>
              </Reveal>
            </div>

            {/* 한 줄 요약 — 마차 카드의 구조 그대로 */}
            <Reveal>
              <div className="mx-auto max-w-md rounded-2xl bg-[#f8f7f4] border border-gray-100 px-7 py-8">
                <p className="serif text-[15px] font-semibold text-center mb-6 tracking-tight">
                  〈한 줄 요약〉
                </p>
                <ol className="space-y-3.5 text-sm leading-relaxed text-gray-600">
                  <li className="flex gap-3">
                    <span className="shrink-0 text-gray-300">1.</span>
                    몰입해야 한다.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-gray-300">2.</span>
                    살아있는 느낌은 몰입에서 나오니까, 몰입을 쌓아가야 한다.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-gray-300">3.</span>
                    현대인이 몰입을 하려면 환경 세팅이 필요하다.
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-gray-300">4.</span>
                    의도적인 몰입이 축적되면, 마침내 그 몰입은 나를 더 세련되게 잘
                    사는 방향으로 밀어준다.
                  </li>
                  <li className="flex gap-3 text-[#1a1a2e] font-semibold">
                    <span className="shrink-0 text-[#e9c46a]">5.</span>
                    그래서, 오늘 내가 할 수 있는 의도적 몰입은 무엇인가?
                  </li>
                </ol>
              </div>
            </Reveal>

            <Reveal>
              <p className="text-center text-sm text-gray-500 mt-10 mb-6 leading-relaxed">
                그 질문에 답하는 두 가지 방법 —
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <Link
                  href="/space"
                  className="py-3.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-medium text-center hover:bg-[#2d2d4e] transition"
                >
                  공간 이용하기 →
                </Link>
                <Link
                  href="/program"
                  className="py-3.5 rounded-xl border border-[#1a1a2e]/20 text-[#1a1a2e] text-sm font-medium text-center hover:border-[#1a1a2e] transition"
                >
                  4주 프로그램 →
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
              <p className="text-sm text-white/50">
                @macha_ver._ · <span className="text-white/80 font-medium">팔로워 1.3만</span>
              </p>
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
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
              >
                <InstaIcon className="w-[18px] h-[18px]" />
                @macha_ver._
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
