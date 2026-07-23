import Link from 'next/link'
import InstaIcon from './InstaIcon'

export default function SiteFooter() {
  return (
    <footer className="px-6 py-12 text-center border-t border-white/10 bg-[#332619]">
      <div className="text-base mb-3">🪑</div>
      <p className="text-sm font-medium mb-3">몰입, 흐름 그리고 나</p>
      <div className="flex items-center justify-center gap-4 text-xs text-[#8f7e69] mb-4">
        <Link href="/space" className="hover:text-[#f0e7d7] transition">공간 대여</Link>
        <span className="text-[#443a2e]">·</span>
        <Link href="/program" className="hover:text-[#f0e7d7] transition">4주 프로그램</Link>
        <span className="text-[#443a2e]">·</span>
        <Link href="/gift" className="hover:text-[#f0e7d7] transition">선물하기</Link>
      </div>
      <p className="text-xs text-[#8f7e69] leading-relaxed mb-1">
        서울 도봉구 도봉로103길 23-13 · 쌍문역 3번 출구 도보 8분
      </p>
      <p className="text-xs text-[#8f7e69] leading-relaxed mb-1">
        24시간 영업 · 연중무휴 ·{' '}
        <a href="tel:0507-1348-9410" className="underline">0507-1348-9410</a>
      </p>
      <p className="text-xs text-[#8f7e69] leading-relaxed mb-4">
        <a
          href="https://www.instagram.com/macha_ver._"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline"
        >
          <InstaIcon className="w-3.5 h-3.5" />
          @macha_ver._
        </a>
      </p>
      <p className="text-xs text-[#6b5e4e]">
        <a href="/admin" className="underline">관리자</a>
      </p>
    </footer>
  )
}
