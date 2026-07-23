import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import ApplyForm from '../components/ApplyForm'
import Reveal from '../components/Reveal'
import StickyCTA from '../components/StickyCTA'
import { PROGRAM, PROGRAM_INCLUDES, CURRICULUM } from '@/lib/program'

export const metadata: Metadata = {
  title: '요청을 현실로 만드는 4주 | 1기 모집',
  description:
    '혼자서는 4주를 못 버티니까, 같이 합니다. 쌍문 몰입 공간에서 진행하는 소수 정원 오프라인 프로그램. 주 1회 마차 운영자의 밀도 높은 강의 + 매일 단톡 실행 인증. 1기 7명 한정 모집 중.',
  openGraph: {
    title: '요청을 현실로 만드는 4주 | 1기 모집',
    description:
      '쌍문 몰입 공간 소수 정원 오프라인 프로그램 · 1기 7명 한정 모집 중.',
  },
}

export default function ProgramPage() {
  return (
    <>
      <Header />
      <main className="text-[#3b2e21]">
        <StickyCTA variant="program" />

        {/* ───────── Hero ───────── */}
        <section className="relative px-6 pt-16 pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[#e9c46a]" />
            <div className="absolute -left-20 top-40 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#7f8f5a]" />
            <div className="absolute -right-16 top-24 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#e76f51]" />
          </div>
          <div className="relative max-w-xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e76f51]/40 bg-[#e76f51]/[0.07] px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e76f51] animate-pulse" />
                <span className="text-xs font-medium tracking-wide text-[#e76f51]">
                  {PROGRAM.cohort} 모집 중 · {PROGRAM.seatsTotal}명 한정
                </span>
              </div>
              <h1 className="serif text-[2.4rem] leading-[1.3] font-semibold tracking-tight mb-6">
                요청을 현실로<br />만드는 4주
              </h1>
              <p className="text-[17px] leading-[1.8] text-[#3b2e21] font-medium mb-3">
                혼자서는 4주를 못 버티니까,<br />같이 합니다.
              </p>
              <p className="text-[15px] leading-relaxed text-gray-500 mb-10">
                쌍문 몰입 공간에서 진행하는<br />
                소수 정원 오프라인 프로그램
              </p>
              <a
                href="#apply"
                className="inline-block px-8 py-3.5 rounded-full bg-[#3b2e21] text-white text-sm font-medium hover:bg-[#4d3c2b] transition"
              >
                {PROGRAM.cohort} 신청하기
              </a>
              <div className="mt-6">
                <Link
                  href="/space"
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 tracking-wide"
                >
                  공간만 이용하고 싶다면 →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="max-w-[60px] mx-auto border-t border-gray-200" />

        {/* ───────── 문제 제기 ───────── */}
        <section className="px-6 py-20 max-w-xl mx-auto text-center">
          <Reveal>
            <p className="text-[17px] leading-[1.9] text-[#3b2e21] font-medium">
              자기계발 콘텐츠는 넘치는데,<br />
              왜 실행은 안 될까요?
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[15px] leading-[2.1] text-gray-500 mt-8">
              의지가 부족해서가 아닙니다.<br />
              <span className="text-[#3b2e21]">환경과 동료</span>가 없었을 뿐.
            </p>
          </Reveal>
        </section>

        {/* ───────── 프로그램 소개 ───────── */}
        <section className="px-6 py-20 bg-[#fdfaf4] border-y border-gray-100">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Program
              </p>
              <h2 className="serif text-xl font-medium text-center mb-12 tracking-tight">
                4주 동안 함께하는 것
              </h2>
            </Reveal>
            <div className="space-y-4">
              {[
                {
                  n: '①',
                  t: '주 1회 오프라인 몰입 세션',
                  d: '쌍문 몰입 공간에서, 총 4회. 4주 커리큘럼에 따라 마차 운영자가 밀도 높은 강의를 진행합니다.',
                },
                {
                  n: '②',
                  t: '매일 단톡방 실행 인증 & 피드백',
                  d: '작은 실행이라도 매일 남기고, 서로 확인합니다. 혼자가 아니라서 이어집니다.',
                },
              ].map((c, i) => (
                <Reveal key={c.n} delay={i * 120}>
                  <div className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-[#f3ece1] p-5">
                    <div className="serif text-2xl text-[#7f8f5a] leading-none shrink-0">
                      {c.n}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold mb-1.5">{c.t}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{c.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 4주 커리큘럼 ───────── */}
        <section className="px-6 py-20">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Curriculum
              </p>
              <h2 className="serif text-xl font-medium text-center mb-14 tracking-tight">
                4주의 흐름
              </h2>
            </Reveal>
            <div className="relative pl-8">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" aria-hidden />
              <div className="space-y-10">
                {CURRICULUM.map((w, i) => (
                  <Reveal key={w.week} delay={i * 100}>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#7f8f5a] bg-[#f3ece1]" />
                      <p className="text-xs tracking-wide text-[#7f8f5a] font-semibold mb-1">
                        {w.week}
                      </p>
                      <h3 className="serif text-[17px] font-medium mb-1.5 tracking-tight">
                        {w.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="mt-16 rounded-2xl border border-gray-100 bg-[#fdfaf4] p-6 text-center">
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                  이런 분께
                </p>
                <p className="text-[15px] leading-[1.9] text-[#3b2e21]">
                  자기계발 콘텐츠를 <span className="text-gray-400">소비만</span> 하다가,<br />
                  <span className="font-semibold">실행이 안 되는 분</span>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 본질: 이 프로그램이 시작된 이야기 ───────── */}
        <section className="px-6 py-20 bg-[#fdfaf4] border-y border-gray-100">
          <div className="max-w-xl mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
                Why
              </p>
              <h2 className="serif text-xl font-medium text-center mb-5 tracking-tight">
                이 프로그램이 시작된 이야기
              </h2>
              <p className="text-sm text-gray-500 text-center leading-relaxed mb-10">
                왜 4주인지, 왜 함께여야 하는지 —<br />
                운영자가 직접 남긴 글을 읽어보세요.
              </p>
            </Reveal>
            <Reveal>
              <div className="mx-auto max-w-md rounded-2xl overflow-hidden border border-gray-100 bg-[#f3ece1] shadow-[0_12px_40px_rgba(26,26,46,0.08)]">
                <iframe
                  src="https://www.instagram.com/p/DYmfB1BEgA4/embed/captioned/"
                  title="요청을 현실로 만드는 4주 — 운영자의 이야기"
                  loading="lazy"
                  scrolling="no"
                  allowFullScreen
                  className="w-full h-[560px] block"
                />
              </div>
              <p className="text-center mt-6">
                <a
                  href="https://www.instagram.com/p/DYmfB1BEgA4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 tracking-wide"
                >
                  인스타그램에서 전체 글 보기 ↗
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 가격 ───────── */}
        <section className="px-6 py-20 bg-[#2b2119] text-white">
          <div className="max-w-md mx-auto">
            <Reveal>
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase text-center mb-3">
                Price
              </p>
              <h2 className="serif text-xl font-medium text-center mb-10 tracking-tight">
                {PROGRAM.cohort} 한정가
              </h2>
            </Reveal>

            <Reveal>
              <div className="text-center mb-8">
                <p className="text-white/40 text-lg line-through decoration-white/30">
                  {PROGRAM.originalPrice.toLocaleString()}원
                </p>
                <p className="serif text-5xl font-bold tracking-tight mt-1">
                  {PROGRAM.price.toLocaleString()}
                  <span className="text-2xl font-medium">원</span>
                </p>
                <p className="text-xs text-[#e9c46a] mt-3 tracking-wide">
                  2기부터 인상됩니다
                </p>
              </div>
            </Reveal>

            <Reveal>
              <ul className="space-y-3.5 mb-8">
                {PROGRAM_INCLUDES.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/80">
                    <span className="text-[#7f8f5a] shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-[#e76f51]/40 bg-[#e76f51]/[0.12] p-5 text-center">
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-white">
                    {PROGRAM.seatsTotal}명 한정 · 선착순 마감
                  </span>
                </p>
                <p className="text-xs text-white/50 mt-1.5">
                  현재 <span className="text-[#e9c46a] font-semibold">{PROGRAM.seatsLeft}자리</span> 남았습니다
                </p>
              </div>
              <div className="text-center mt-8">
                <a
                  href="#apply"
                  className="inline-block px-8 py-3.5 rounded-full bg-[#fdfaf4] text-[#3b2e21] text-sm font-semibold hover:bg-gray-100 transition"
                >
                  {PROGRAM.cohort} 신청하기
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 신청 폼 ───────── */}
        <section id="apply" className="px-6 py-20 scroll-mt-16">
          <div className="max-w-md mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                  Apply
                </p>
                <h2 className="serif text-xl font-medium tracking-tight mb-4">
                  {PROGRAM.cohort}에 함께하기
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {PROGRAM.seatsTotal}명 한정, 선착순으로 마감됩니다.<br />
                  먼저 신청서를 남겨주세요.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <ApplyForm />
            </Reveal>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className="px-6 py-20 bg-[#fdfaf4] border-y border-gray-100">
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
                    q: '몰입 초보인데 따라갈 수 있나요?',
                    a: '네. 이 프로그램은 이미 잘하는 사람이 아니라, 실행이 자꾸 미뤄지는 분을 위해 만들었어요. 매일의 작은 실행부터 함께 쌓아가니 초보일수록 효과가 큽니다.',
                  },
                  {
                    q: '오프라인 세션 요일과 시간은 언제인가요?',
                    a: '추후 확정되며, 신청자들과 협의해 정합니다. 대부분 참여 가능한 요일·시간대로 맞춰요.',
                  },
                  {
                    q: '환불 규정은 어떻게 되나요?',
                    a: '시작 전 100% 환불, 1주차 종료 후 50% 환불, 2주차 이후에는 환불이 어렵습니다.',
                  },
                  {
                    q: '쌍문에서 멀리 사는데 참여 가능한가요?',
                    a: '오프라인 세션은 주 1회라, 서울·수도권에 계시면 충분히 참여하실 수 있어요. 나머지는 단톡방에서 이어집니다.',
                  },
                  {
                    q: '공간만 따로 이용할 수도 있나요?',
                    a: '네! 프로그램과 별개로 24시간 이용권(4,500원)으로 몰입 공간만 이용하실 수 있어요. 상단 메뉴의 공간 대여에서 신청하시면 됩니다.',
                  },
                ].map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-gray-100 bg-[#f3ece1] overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-6 cursor-pointer list-none text-[15px] font-medium text-[#3b2e21] py-4">
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

        <SiteFooter />
      </main>
    </>
  )
}
