// 릴스 공장: 잘된 릴스의 "왜 터졌나" 공식을 저장하고, 그 공식으로 대본을 뽑는다.
// 외부 AI 호출 없이 템플릿 치환으로만 동작한다.

export type FormulaKey = 'hook' | 'proof' | 'list' | 'cta'

export interface FormulaStep {
  key: FormulaKey
  label: string // pill·짧은 표기
  title: string // 단계명
  desc: string // 설명
}

// 공식 4단계 (문구 스펙 그대로)
export const FORMULA_STEPS: FormulaStep[] = [
  {
    key: 'hook',
    label: '후킹',
    title: '간과 프레임 후킹',
    desc: '"알지만 잊고 산다"로 찌르기',
  },
  {
    key: 'proof',
    label: '증거',
    title: '독자 삶이 증거',
    desc: '외부 사례 말고 "네 주위를 봐"',
  },
  {
    key: 'list',
    label: '리스트',
    title: '번호 리스트 착지',
    desc: '추상 → 구체 행동 (저장 유발)',
  },
  {
    key: 'cta',
    label: 'CTA',
    title: '게이트 걸린 CTA',
    desc: '"필요한 사람만 댓글" → 링크',
  },
]

export const FORMULA_KEYS: FormulaKey[] = FORMULA_STEPS.map((s) => s.key)

export function stepByKey(key: FormulaKey): FormulaStep {
  return FORMULA_STEPS.find((s) => s.key === key)!
}

// 올리기 전 체크 4줄 (문구 스펙 그대로)
export const PRE_CHECK: string[] = [
  '첫 3초에 "뜨끔"이 있나?',
  '남 얘기 말고 "네 삶"으로 말했나?',
  '저장하고 싶은 리스트인가?',
  '링크는 프로필 맨 위에 걸려 있나?',
]

// ───────── 대본 생성기 (템플릿 치환) ─────────
export interface ScriptInput {
  topic: string // 주제
  known: string // 알지만 잊고 사는 사실
  listItems: string[] // 번호 리스트 항목
  ctaKeyword: string // CTA 키워드
  give: string // 줄 것
}

export function generateReelScript(input: ScriptInput): string {
  const topic = input.topic.trim() || '(주제)'
  const known = input.known.trim() || '(알지만 잊고 사는 사실)'
  const items = input.listItems.map((s) => s.trim()).filter(Boolean)
  const ctaKeyword = input.ctaKeyword.trim() || '몰입'
  const give = input.give.trim() || '(줄 것)'

  const listBlock = items.length
    ? items.map((it, i) => `${i + 1}. ${it}`).join('\n')
    : '1. (구체 행동 1)\n2. (구체 행동 2)\n3. (구체 행동 3)'

  return `🎬 ${topic}

━━━━━━━━━━━━━━━
① HOOK — 첫 3초 (간과 프레임)
━━━━━━━━━━━━━━━
"${known}"
…알지만, 우리 다 잊고 살죠.

━━━━━━━━━━━━━━━
② PROOF — 네 삶이 증거
━━━━━━━━━━━━━━━
멀리 갈 것도 없어요.
당장 오늘 ${topic}, 당신 얘기 아닌가요?
남의 사례 말고 — 지금 당신 주위를 보세요.

━━━━━━━━━━━━━━━
③ LIST — 저장 유발 (번호 착지)
━━━━━━━━━━━━━━━
${listBlock}

━━━━━━━━━━━━━━━
④ CTA — 게이트 걸린 콜
━━━━━━━━━━━━━━━
${give}
필요한 분만 '${ctaKeyword}' 댓글 남겨주세요.
→ 프로필 맨 위 링크에서 확인하세요.

──────────────
✅ 올리기 전 체크
${PRE_CHECK.map((c) => `· ${c}`).join('\n')}`
}
