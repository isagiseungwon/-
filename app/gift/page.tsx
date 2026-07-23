import type { Metadata } from 'next'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import GiftForm from '../components/GiftForm'
import Reveal from '../components/Reveal'

export const metadata: Metadata = {
  title: '몰입을 선물하세요',
  description:
    '시험을 앞둔 친구에게, 번아웃이 온 동료에게 — 조용한 몰입의 시간을 선물하세요. 24시간 이용권 4,500원부터.',
  openGraph: {
    title: '몰입을 선물하세요 | 몰입, 흐름 그리고 나',
    description:
      '소중한 사람에게 조용한 몰입의 시간을 선물하세요. 24시간 이용권 4,500원부터.',
  },
}

export default function GiftPage() {
  return (
    <>
      <Header />
      <main className="text-[#f0e7d7]">
        <section className="relative px-6 pt-16 pb-24 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="glow-breathe absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl bg-[#e9c46a]" />
            <div className="glow-breathe-delay absolute -left-16 top-48 w-56 h-56 rounded-full blur-3xl bg-[#e76f51]" />
          </div>

          <div className="relative max-w-md mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="float-soft inline-block text-4xl mb-8">🎁</div>
                <h1 className="serif text-[2rem] leading-[1.35] font-semibold tracking-tight mb-5">
                  몰입을<br />선물하세요
                </h1>
                <p className="text-[15px] leading-[1.95] text-[#aa9a83]">
                  시험을 앞둔 친구에게,<br />
                  번아웃이 온 동료에게,<br />
                  생각이 많아진 가족에게 —
                </p>
                <p className="text-[15px] leading-[1.95] text-[#f0e7d7] font-medium mt-4">
                  물건 대신, 조용한 시간을.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <GiftForm />
            </Reveal>

            <Reveal>
              <div className="mt-10 rounded-2xl border border-white/10 bg-[#332619] p-6">
                <p className="text-xs tracking-[0.2em] text-[#8f7e69] uppercase mb-4">
                  이렇게 진행돼요
                </p>
                <ol className="space-y-3 text-sm text-[#d0c3ad]">
                  <li className="flex gap-3">
                    <span className="text-[#e9c46a] font-semibold shrink-0">1</span>
                    선물 종류를 고르고 신청서를 보내주세요
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#e9c46a] font-semibold shrink-0">2</span>
                    입금이 확인되면, 받는 분께 전할 선물 안내를 보내드려요
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#e9c46a] font-semibold shrink-0">3</span>
                    받는 분은 편한 날에 방문해 조용한 하루를 누리면 끝
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  )
}
