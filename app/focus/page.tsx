import type { Metadata } from 'next'
import Link from 'next/link'
import FocusTimer from '../components/FocusTimer'

export const metadata: Metadata = {
  title: '10분 몰입 체험',
  description:
    '말로만 말고, 지금 10분. 폰을 뒤집고 딱 하나에만 몰입해 보세요. 쌍문 몰입 공간이 준비한 무료 몰입 체험.',
  openGraph: {
    title: '10분 몰입 체험 | 몰입, 흐름 그리고 나',
    description: '말로만 말고, 지금 10분. 딱 하나에만 몰입해 보세요.',
  },
}

// 몰입을 깨지 않도록 헤더 없이 최소한의 화면만 둔다.
export default function FocusPage() {
  return (
    <main className="relative min-h-screen flex flex-col text-[#3b2e21] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-breathe absolute left-1/2 -translate-x-1/2 -top-24 w-80 h-80 rounded-full blur-3xl bg-[#e9c46a]" />
        <div className="glow-breathe-delay absolute -left-20 bottom-24 w-64 h-64 rounded-full blur-3xl bg-[#7f8f5a]" />
      </div>

      <div className="relative px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← 몰입, 흐름 그리고 나
        </Link>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <FocusTimer />
        </div>
      </div>
    </main>
  )
}
