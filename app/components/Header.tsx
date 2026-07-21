'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: '홈' },
  { href: '/program', label: '4주 프로그램' },
  { href: '/space', label: '공간 대여' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#f8f7f4]/85 backdrop-blur border-b border-black/[0.06]">
      <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-[#1a1a2e]"
        >
          <span>🪑</span>
          <span className="serif">몰입, 흐름 그리고 나</span>
        </Link>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative w-9 h-9 -mr-1.5 flex items-center justify-center"
        >
          <span className="sr-only">메뉴</span>
          <div className="flex flex-col gap-[5px] items-end">
            <span
              className={`block h-[1.5px] bg-[#1a1a2e] transition-all duration-300 ${
                open ? 'w-5 translate-y-[6.5px] rotate-45' : 'w-5'
              }`}
            />
            <span
              className={`block h-[1.5px] bg-[#1a1a2e] transition-all duration-300 ${
                open ? 'opacity-0 w-5' : 'w-4'
              }`}
            />
            <span
              className={`block h-[1.5px] bg-[#1a1a2e] transition-all duration-300 ${
                open ? 'w-5 -translate-y-[6.5px] -rotate-45' : 'w-5'
              }`}
            />
          </div>
        </button>
      </div>

      {/* 드롭다운 메뉴 */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="max-w-xl mx-auto px-5 pb-4 pt-1">
          <ul className="flex flex-col divide-y divide-black/[0.05]">
            {NAV.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-3.5 text-[15px] transition ${
                      active
                        ? 'text-[#1a1a2e] font-semibold'
                        : 'text-gray-500 hover:text-[#1a1a2e]'
                    }`}
                  >
                    {item.label}
                    <span className="text-gray-300">→</span>
                  </Link>
                </li>
              )
            })}
            <li>
              <a
                href="https://www.instagram.com/macha_ver._"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3.5 text-[15px] text-gray-500 hover:text-[#1a1a2e] transition"
              >
                📷 인스타그램
                <span className="text-gray-300">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
