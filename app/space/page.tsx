import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import BookingForm from '../components/BookingForm'
import MembershipForm from '../components/MembershipForm'
import Reveal from '../components/Reveal'
import GalleryMarquee from '../components/GalleryMarquee'
import StickyCTA from '../components/StickyCTA'
import { DAY_PASS, MEMBERSHIP } from '@/lib/types'
import { REVIEWS } from '@/lib/reviews'

export const metadata: Metadata = {
  title: '24시간 몰입 공간 4,500원 | 쌍문역 공간 대여',
  description:
    '방해받지 않고 온전히 나에게 집중하는 시간. 쌍문역 3번 출구 도보 8분, 24시간 연중무휴, 와이파이·물 제공, 음료 반입 가능. 24시간 이용권 4,500원.',
  openGraph: {
    title: '24시간 몰입 공간 4,500원 | 쌍문역 공간 대여',
    description:
      '쌍문역 조용한 골목, 방해받지 않는 나만의 자리. 24시간 이용권 4,500원.',
  },
}

export default function SpacePage() {
  return (
    <>
      <Header />
      <main className="text-[#1a1a2e]">
        <StickyCTA variant="space" />

        {/* ───────── Hero ───────── */}
        <section className="relative px-6 pt-16 pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[#e9c46a]" />
            <div className="absolute -left-20 top-40 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#2a9d8f]" />
          </div>
          <div className="relative max-w-xl mx-auto text-center">
            <Reveal>
              <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-6">
                24시간 4,500원 몰입 공간
              </p>
              <h1 className="serif text-[2.4rem] leading-[1.3] font-semibold tracking-tight mb-6">
                24시간<br />몰입 공간
              </h1>
              <p className="text-[17px] leading-[1.8] text-[#1a1a2e] font-medium mb-3">
                오늘, 3분 이상<br />무언가에 집중해 본 적 있나요?
              </p>
              <p className="text-[15px] leading-relaxed text-gray-500 mb-10">
                알림도, 시선도 없는 곳에서<br />
                온전히 나에게 집중하는 시간
              </p>
              <a
                href="#booking"
                className="inline-block px-8 py-3.5 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2d2d4e] transition"
              >
                예약하기
              </a>
              <p className="text-xs text-gray-400 mt-6 tracking-wide">
                24시간 4,500원 · 쌍문역 3번 출구
              </p>
              <div className="mt-4">
                <Link
                  href="/program"
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 tracking-wide"
                >
                  함께 해내는 4주 프로그램이 궁금하다면 →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="max-w-[60px] mx-auto border-t border-gray-200" />

        {/* ───────── 공감 (문제 제기) ───────── */}
        <section className="px-6 py-20 max-w-xl mx-auto text-center">
          <Reveal>
            <p className="text-[15px] leading-[2.1] text-gray-600">
              해야 할 일을 펼쳐 놓고도<br />
              5분마다 폰을 집어 들고,
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[15px] leading-[2.1] text-gray-600 mt-8">
              카페에 가면 소음과 시선에,<br />
              집에 있으면 침대의 유혹에 무너지고.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[15px] leading-[2.1] text-[#1a1a2e] font-medium mt-8">
              의지가 약해서가 아닙니다.<br />
              몰입할 수 있는 <u className="underline-offset-4">환경</u>이 없었을 뿐.
            </p>
          </Reveal>
        </section>

        {/* ───────── 해결책 (컨셉) ───────── */}
        <section className="px-6 py-20 bg-white border-y border-gray-100">
          <div className="max-w-xl mx-auto text-center">
            <Reveal>
              <h2 className="serif text-xl font-medium mb-5 tracking-tight">
                그래서, 환경을 만들었습니다
              </h2>
              <p className="text-[15px] leading-[1.9] text-gray-500">
                흩어진 생각을 하나로 모으는 일에는<br />
                방해받지 않는 시간과 공간이 필요합니다.<br />
                잠시 머물며, 오롯이 몰입해 보세요.
              </p>
              <p className="text-[15px] leading-[1.9] text-gray-500 mt-6">
                일기, 독서, 생각 정리, 아이디어 —<br />
                무엇이든 좋습니다.{' '}
                <span className="text-[#1a1a2e] font-medium">한 호흡에 하나만.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 이용 방법 ───────── */}
        <section className="px-6 py-16">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-12">
                이용 방법
              </p>
            </Reveal>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { n: '01', t: '시간 선택', d: '원하는 날짜와\n시간을 고르고' },
                { n: '02', t: '간편 결제', d: '카드·계좌이체로\n바로 예약' },
                { n: '03', t: '입실', d: '예약한 시간에\n방문하면 끝' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 120}>
                  <div className="text-sm text-gray-300 mb-3 font-medium">{s.n}</div>
                  <div className="text-[15px] font-medium mb-2">{s.t}</div>
                  <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                    {s.d}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 특징 ───────── */}
        <section className="px-6 pb-4 pt-8 max-w-xl mx-auto">
          <div className="space-y-10">
            {[
              { t: '온전한 고요', d: '방해 없는 환경에서 깊이 몰입할 수 있어요.' },
              { t: '합리적인 가격', d: '커피 한 잔 값으로 누리는 나만의 시간.' },
              { t: '편한 방문', d: '예약 없이도, 혼자 또는 단둘이 오셔도 좋아요.' },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 120}>
                <div className="flex gap-5 items-start">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1a1a2e] shrink-0" />
                  <div>
                    <h3 className="text-[15px] font-medium mb-1.5">{f.t}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────── 요금: 하루 vs 멤버십 ───────── */}
        <section className="px-6 py-20 mt-8 bg-white border-y border-gray-100">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Price
              </p>
              <h2 className="serif text-xl font-medium text-center mb-12 tracking-tight">
                머무는 방법, 두 가지
              </h2>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* 하루 이용권 */}
              <Reveal>
                <div className="h-full rounded-3xl border border-gray-200 bg-[#f8f7f4] p-7 flex flex-col">
                  <p className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-3">
                    가볍게
                  </p>
                  <h3 className="serif text-lg font-semibold mb-1">{DAY_PASS.label}</h3>
                  <p className="serif text-3xl font-bold tracking-tight mb-3">
                    {DAY_PASS.price.toLocaleString()}
                    <span className="text-base font-medium">원</span>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500 mb-6 flex-1">
                    <li>입실부터 24시간</li>
                    <li>자유로운 외출과 출입</li>
                    <li>예약 없이 방문도 가능</li>
                  </ul>
                  <a
                    href="#booking"
                    className="block py-3.5 rounded-xl border border-[#1a1a2e]/25 text-center text-sm font-medium text-[#1a1a2e] hover:border-[#1a1a2e] transition"
                  >
                    하루 예약하기
                  </a>
                </div>
              </Reveal>

              {/* 멤버십 */}
              <Reveal delay={120}>
                <div className="relative h-full rounded-3xl bg-[#12122a] text-white p-7 flex flex-col shadow-[0_16px_48px_rgba(18,18,42,0.25)]">
                  <span className="absolute -top-3 left-6 rounded-full bg-[#e9c46a] text-[#1a1a2e] text-[11px] font-bold px-3 py-1">
                    매일 오는 분께
                  </span>
                  <p className="text-xs tracking-[0.15em] text-white/40 uppercase mb-3">
                    깊게
                  </p>
                  <h3 className="serif text-lg font-semibold mb-1">{MEMBERSHIP.label}</h3>
                  <p className="serif text-3xl font-bold tracking-tight mb-3">
                    월 {MEMBERSHIP.price.toLocaleString()}
                    <span className="text-base font-medium">원</span>
                  </p>
                  <ul className="space-y-2 text-sm text-white/70 mb-6 flex-1">
                    <li>한 달 <strong className="text-white">무제한</strong> 이용</li>
                    <li>월 11회부터는 멤버십이 이득</li>
                    <li>나만의 몰입 루틴 만들기</li>
                  </ul>
                  <a
                    href="#membership"
                    className="block py-3.5 rounded-xl bg-white text-center text-sm font-semibold text-[#1a1a2e] hover:bg-gray-100 transition"
                  >
                    멤버십 시작하기
                  </a>
                </div>
              </Reveal>
            </div>

            {/* 선물 배너 */}
            <Reveal>
              <Link
                href="/gift"
                className="group mt-4 flex items-center justify-between rounded-2xl border border-[#e9c46a]/40 bg-[#e9c46a]/[0.07] px-6 py-5 transition hover:border-[#e9c46a]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="text-[15px] font-medium text-[#1a1a2e]">
                      소중한 사람에게 몰입을 선물하세요
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      물건 대신, 조용한 시간을 · {DAY_PASS.price.toLocaleString()}원부터
                    </p>
                  </div>
                </div>
                <span className="text-[#b8860b] text-sm transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ───────── 공간 & 위치 ───────── */}
        <section className="py-20 mt-8 bg-white border-y border-gray-100 overflow-hidden">
          <div className="max-w-md mx-auto text-center px-6">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-2">
                Space
              </p>
            </Reveal>
          </div>

          <Reveal>
            <GalleryMarquee />
          </Reveal>

          <div className="max-w-md mx-auto text-center px-6 mt-8">
            <Reveal>
              <p className="text-[15px] leading-[1.9] text-gray-600 mb-6">
                값비싼 몰입의 시간을 사는,<br />
                〈몰입, 흐름 그리고 나〉는<br />
                <span className="text-[#1a1a2e] font-medium">쌍문역 3번 출구</span>에서 도보 8분,<br />
                조용한 골목에 있습니다.
              </p>
              <p className="text-sm leading-relaxed text-gray-500 mb-10">
                혼자, 혹은 친구와 단둘이 오셔서<br />
                평온한 럭셔리를 누리시길 바라요.
              </p>

              <div className="rounded-2xl border border-gray-100 bg-[#f8f7f4] p-6 text-left mb-8">
                <ul className="space-y-3.5 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="shrink-0">🕐</span>
                    <span>
                      <strong className="text-[#1a1a2e] font-medium">24시간 영업</strong> · 연중무휴
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0">☕</span>
                    <span>
                      음료, 커피 편히 가져오셔도 좋습니다.<br />
                      <span className="text-gray-500">물은 준비되어 있습니다.</span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0">📶</span>
                    <span>와이파이 <strong className="text-[#1a1a2e] font-medium">있습니다</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0">🚪</span>
                    <span>자유로운 외출과 출입 가능</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0">📍</span>
                    <span>서울 도봉구 도봉로103길 23-13</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:0507-1348-9410"
                  className="py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#1a1a2e] hover:border-gray-400 transition"
                >
                  📞 전화하기
                </a>
                <a
                  href="https://map.naver.com/p/search/%EB%AA%B0%EC%9E%85%2C%20%ED%9D%90%EB%A6%84%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%EB%82%98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 rounded-xl bg-[#03c75a] text-sm font-medium text-white hover:opacity-90 transition"
                >
                  🗺️ 네이버 길찾기
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-[#03c75a]/30 bg-[#03c75a]/[0.04] p-5 text-center">
                <p className="text-sm text-gray-600 mb-1">
                  다녀가셨다면, <strong className="text-[#1a1a2e]">첫 이야기</strong>를 남겨주세요
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  이제 막 문을 연 공간이라, 한 줄의 후기가 큰 힘이 됩니다
                </p>
                <a
                  href="https://map.naver.com/p/search/%EB%AA%B0%EC%9E%85%2C%20%ED%9D%90%EB%A6%84%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%EB%82%98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl border border-[#03c75a] text-[#03c75a] text-sm font-semibold hover:bg-[#03c75a] hover:text-white transition"
                >
                  ⭐ 네이버 리뷰 남기기
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 공간 대관 ───────── */}
        <section className="px-6 py-20">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Rent
              </p>
              <h2 className="serif text-xl font-medium text-center mb-4 tracking-tight">
                공간 전체를 빌릴 수도 있어요
              </h2>
              <p className="text-sm text-gray-500 text-center leading-relaxed mb-10">
                조용한 골목의 몰입 공간을 통째로.<br />
                모임의 밀도가 달라집니다.
              </p>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { e: '📚', t: '스터디 · 독서 모임' },
                  { e: '🧑‍💻', t: '팀 워크숍 · 집중 회의' },
                  { e: '🎬', t: '인터뷰 · 촬영' },
                  { e: '✍️', t: '글쓰기 · 창작 모임' },
                ].map((u, i) => (
                  <div
                    key={u.t}
                    className="rounded-2xl border border-gray-100 bg-white p-5 text-center"
                  >
                    <div className="text-2xl mb-2">{u.e}</div>
                    <p className="text-sm font-medium text-[#1a1a2e]">{u.t}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  대관료는 인원·시간대에 따라 협의해요.<br />
                  원하는 날짜와 용도를 알려주시면 빠르게 안내드립니다.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:0507-1348-9410"
                    className="py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#1a1a2e] hover:border-gray-400 transition"
                  >
                    📞 전화 문의
                  </a>
                  <a
                    href="https://www.instagram.com/macha_ver._"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 rounded-xl bg-[#1a1a2e] text-sm font-medium text-white hover:bg-[#2d2d4e] transition"
                  >
                    DM으로 문의
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 방문자 후기 (실제 후기가 있을 때만 표시) ───────── */}
        {REVIEWS.length > 0 && (
          <section className="px-6 py-20 bg-white border-y border-gray-100">
            <div className="max-w-xl mx-auto">
              <Reveal>
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                  Reviews
                </p>
                <h2 className="serif text-xl font-medium text-center mb-4 tracking-tight">
                  다녀간 분들의 이야기
                </h2>
                <p className="text-sm text-gray-400 text-center mb-12">
                  실제 방문자분들이 남겨주신 후기입니다
                </p>
              </Reveal>
              <div className="space-y-4">
                {REVIEWS.map((r, i) => (
                  <Reveal key={`${r.name}-${i}`} delay={i * 100}>
                    <figure className="rounded-2xl border border-gray-100 bg-[#f8f7f4] p-6 relative">
                      <span
                        className="serif absolute top-3 left-5 text-3xl text-[#e9c46a] leading-none"
                        aria-hidden
                      >
                        &ldquo;
                      </span>
                      <blockquote className="pt-3">
                        <p className="text-[15px] leading-[1.9] text-gray-600">
                          {r.text}
                        </p>
                      </blockquote>
                      <figcaption className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-medium text-gray-500">{r.name}</span>
                        <span className="text-gray-300">·</span>
                        <span>{r.source}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── FAQ ───────── */}
        <section className="px-6 py-20">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                FAQ
              </p>
              <h2 className="serif text-xl font-medium text-center mb-12 tracking-tight">
                자주 묻는 질문
              </h2>
            </Reveal>
            <Reveal>
              <div className="space-y-3">
                {[
                  {
                    q: '어떤 걸 하는 공간인가요?',
                    a: '일기 쓰기, 독서, 생각 정리, 아이디어 스케치 — 무엇이든 좋아요. 오로지 한 호흡에 하나에 몰입할 수 있도록 조용한 환경을 준비했습니다.',
                  },
                  {
                    q: '예약 없이 방문해도 되나요?',
                    a: '네! 예약 없이 편히 방문하실 수 있어요. 다만 자리를 확실히 보장받고 싶다면 미리 예약을 추천드려요.',
                  },
                  {
                    q: '음료나 커피를 가져가도 되나요?',
                    a: '네! 음료, 커피 편히 가져오셔도 좋습니다. 물은 준비되어 있고, 와이파이도 쓰실 수 있어요.',
                  },
                  {
                    q: '중간에 나갔다 와도 되나요?',
                    a: '네, 이용 시간 내 자유로운 외출과 출입이 가능합니다.',
                  },
                  {
                    q: '혼자 가도 어색하지 않을까요?',
                    a: '혼자 오시는 분들을 위해 만든 공간이에요. 각자의 몰입을 존중하는 조용한 분위기라 오히려 혼자일 때 가장 편안합니다. 친구와 단둘이 오셔도 좋아요.',
                  },
                  {
                    q: '몇 시까지 하나요?',
                    a: '24시간, 연중무휴로 운영됩니다. 새벽의 고요함이 필요할 때도 언제든 오세요.',
                  },
                  {
                    q: '멤버십은 어떻게 이용하나요?',
                    a: '월 49,000원으로 한 달간 무제한 이용할 수 있어요. 신청 후 입금이 확인된 날부터 시작되고, 월 11회 이상 오신다면 하루 이용권보다 이득입니다.',
                  },
                  {
                    q: '단체로 공간을 빌릴 수 있나요?',
                    a: '네, 스터디·워크숍·촬영 등 대관이 가능합니다. 인원과 시간대에 따라 협의하니 전화나 인스타 DM으로 편하게 문의해 주세요.',
                  },
                ].map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-gray-100 bg-[#f8f7f4] overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-6 cursor-pointer list-none text-[15px] font-medium text-[#1a1a2e] py-4">
                      {item.q}
                      <span className="text-gray-300 transition-transform group-open:rotate-45 text-lg leading-none">
                        +
                      </span>
                    </summary>
                    <p className="px-6 pb-5 text-sm leading-relaxed text-gray-500">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 예약 폼 ───────── */}
        <section id="booking" className="px-6 py-20 bg-white border-t border-gray-100 scroll-mt-16">
          <div className="max-w-md mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                  예약하기
                </p>
                <h2 className="serif text-xl font-medium tracking-tight mb-4">
                  오늘, 한 시간만<br />나에게 선물하세요
                </h2>
                <p className="text-sm text-gray-500">
                  커피 한 잔 값이면 충분합니다
                </p>
              </div>
            </Reveal>
            <BookingForm />
            <p className="text-center text-xs text-gray-400 mt-8">
              결제 후 입실 시간이 확정됩니다
            </p>
          </div>
        </section>

        {/* ───────── 멤버십 신청 ───────── */}
        <section id="membership" className="px-6 py-20 border-t border-gray-100 scroll-mt-16">
          <div className="max-w-md mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                  Membership
                </p>
                <h2 className="serif text-xl font-medium tracking-tight mb-4">
                  매일의 몰입,<br />월 {MEMBERSHIP.price.toLocaleString()}원
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  한 달 무제한. 커피 열 잔 값으로<br />
                  나만의 서재가 생기는 셈이에요.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <MembershipForm />
            </Reveal>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  )
}
