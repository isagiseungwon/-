import type { Metadata } from 'next'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import Quiz from '../components/Quiz'

export const metadata: Metadata = {
  title: '몰입 유형 테스트 — 나는 왜 몰입이 안 될까?',
  description:
    '1분이면 끝나는 무료 몰입 유형 테스트. 8개 질문으로 내 몰입을 깨는 진짜 원인을 분석하고, 유형별 맞춤 처방을 받아보세요.',
  openGraph: {
    title: '몰입 유형 테스트 — 나는 왜 몰입이 안 될까?',
    description:
      '1분 무료 테스트로 내 몰입 유형과 맞춤 처방을 확인해 보세요.',
  },
}

export default function TestPage() {
  return (
    <>
      <Header />
      <main className="text-[#1a1a2e]">
        <section className="relative px-6 pt-16 pb-24 overflow-hidden min-h-[80vh]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="glow-breathe absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl bg-[#e9c46a]" />
            <div className="glow-breathe-delay absolute -right-16 top-40 w-56 h-56 rounded-full blur-3xl bg-[#2a9d8f]" />
          </div>
          <div className="relative max-w-md mx-auto">
            <Quiz />
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  )
}
