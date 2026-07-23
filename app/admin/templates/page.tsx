'use client'

import { useState } from 'react'
import { REPORT_TEMPLATES } from '@/lib/reportTemplates'

// 리드에게 보낼 DM 리포트 템플릿 모음.
// 유형에 맞는 템플릿을 복사해 {이름}만 바꿔 보내면 된다.
export default function TemplatesPage() {
  const [copied, setCopied] = useState('')

  async function copy(key: string, body: string) {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      alert('복사에 실패했어요. 텍스트를 직접 선택해 복사해주세요.')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-[#f0e7d7]">📋 DM 리포트 템플릿</h1>
        <a href="/admin" className="text-sm text-[#aa9a83] hover:text-[#e3d8c5]">
          ← 대시보드
        </a>
      </div>
      <p className="text-sm text-[#aa9a83] mb-8 leading-relaxed">
        테스트 리드가 들어오면, 리드의 유형에 맞는 템플릿을 복사해서
        <strong className="text-[#f0e7d7]"> {'{이름}'}만 실제 이름으로 바꾼 뒤</strong> DM
        또는 문자로 보내주세요. 24시간 안에 보내는 게 신뢰의 핵심이에요.
      </p>

      <div className="space-y-6">
        {REPORT_TEMPLATES.map((t) => (
          <div key={t.key} className="bg-[#332619] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#f0e7d7]">
                {t.emoji} {t.title}
              </h2>
              <button
                onClick={() => copy(t.key, t.body)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  copied === t.key
                    ? 'bg-green-600 text-white'
                    : 'bg-[#e9c46a] text-[#241a10] hover:bg-[#d9b45a]'
                }`}
              >
                {copied === t.key ? '복사됨 ✓' : '전체 복사'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#d0c3ad] bg-[#2b2018] rounded-xl p-5 font-[inherit]">
              {t.body}
            </pre>
          </div>
        ))}
      </div>
    </main>
  )
}
