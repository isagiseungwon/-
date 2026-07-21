// 몰입 유형 테스트.
// 답변마다 두 축의 점수가 쌓인다:
//  - env  : 환경 취약 (소음·유혹·공간이 몰입을 깨는 정도)
//  - peer : 실행·지속 취약 (혼자서는 못 잇는 정도)
// 최종 유형은 두 축의 높낮이 조합으로 결정된다.

export interface QuizOption {
  label: string
  env: number
  peer: number
}

export interface QuizQuestion {
  q: string
  options: QuizOption[]
}

export const QUIZ: QuizQuestion[] = [
  {
    q: '집중하려고 자리에 앉으면\n가장 먼저 벌어지는 일은?',
    options: [
      { label: '주변 소리와 알림에 자꾸 신경이 쓰인다', env: 2, peer: 0 },
      { label: '뭐부터 할지 몰라 딴짓으로 샌다', env: 0, peer: 2 },
      { label: '일단 폰부터 확인하게 된다', env: 1, peer: 1 },
      { label: '비교적 바로 시작하는 편이다', env: 0, peer: 0 },
    ],
  },
  {
    q: '카페에서 공부나 작업을\n해 본 경험은 어땠나요?',
    options: [
      { label: '소음과 시선 때문에 오래 못 있었다', env: 2, peer: 0 },
      { label: '분위기만 내다가 결과물이 없었다', env: 0, peer: 2 },
      { label: '자리 잡고 세팅하다 에너지를 다 썼다', env: 1, peer: 0 },
      { label: '꽤 잘 되는 편이었다', env: 0, peer: 0 },
    ],
  },
  {
    q: '"내일부터 진짜 한다"\n그 결심의 수명은?',
    options: [
      { label: '3일을 넘기기 어렵다', env: 0, peer: 2 },
      { label: '일주일은 가는데 흐지부지된다', env: 0, peer: 1 },
      { label: '환경이 받쳐주면 꽤 오래 간다', env: 1, peer: 0 },
      { label: '결심하면 대체로 지킨다', env: 0, peer: 0 },
    ],
  },
  {
    q: '집에서 집중이 안 되는\n가장 큰 이유는?',
    options: [
      { label: '침대, TV, 냉장고… 유혹이 너무 많다', env: 2, peer: 0 },
      { label: '지켜보는 사람이 없으니 안 하게 된다', env: 0, peer: 2 },
      { label: '가족·룸메이트 등 방해가 잦다', env: 1, peer: 0 },
      { label: '집에서도 잘 되는 편이다', env: 0, peer: 0 },
    ],
  },
  {
    q: '자기계발 영상이나 책을\n보고 난 다음에는?',
    options: [
      { label: '그때뿐, 실행으로 이어지지 않는다', env: 0, peer: 2 },
      { label: '메모까진 하는데 다시 안 본다', env: 0, peer: 1 },
      { label: '실행할 조용한 시간·장소가 없다', env: 1, peer: 0 },
      { label: '하나라도 바로 적용해 본다', env: 0, peer: 0 },
    ],
  },
  {
    q: '몰입이 깨질 때,\n보통 범인은 무엇인가요?',
    options: [
      { label: '알림, 메신저, SNS', env: 2, peer: 0 },
      { label: '"이게 맞나?" 하는 잡생각', env: 0, peer: 1 },
      { label: '피로와 졸음', env: 0, peer: 1 },
      { label: '잘 안 깨지는 편이다', env: 0, peer: 0 },
    ],
  },
  {
    q: '혼자 할 때와 누군가와\n함께할 때, 나는?',
    options: [
      { label: '누가 같이 하면 확실히 더 하게 된다', env: 0, peer: 2 },
      { label: '혼자가 편하지만 쉽게 흐트러진다', env: 1, peer: 1 },
      { label: '혼자서도 환경만 좋으면 잘한다', env: 1, peer: 0 },
      { label: '어디서든 비슷하게 한다', env: 0, peer: 0 },
    ],
  },
  {
    q: '지금 나에게\n가장 필요한 것은?',
    options: [
      { label: '방해 없는 나만의 자리', env: 2, peer: 0 },
      { label: '끝까지 해내게 하는 동료와 약속', env: 0, peer: 2 },
      { label: '솔직히 둘 다 절실하다', env: 1, peer: 1 },
      { label: '지금 리듬을 한 단계 높이고 싶다', env: 0, peer: 0 },
    ],
  },
]

export type ResultKey = 'env' | 'peer' | 'both' | 'ready'

export interface QuizResult {
  key: ResultKey
  emoji: string
  title: string
  tagline: string
  analysis: string[] // 문제점 분석 (문단)
  solutions: { t: string; d: string }[] // 오늘부터 할 수 있는 처방
  cta: 'space' | 'program' // 우선 추천 상품
  ctaReason: string
}

export const RESULTS: Record<ResultKey, QuizResult> = {
  env: {
    key: 'env',
    emoji: '🎧',
    title: '환경 민감형 몰입가',
    tagline: '의지의 문제가 아니라, 공간의 문제였습니다.',
    analysis: [
      '당신은 집중력이 없는 사람이 아닙니다. 오히려 감각이 예민해서, 소음·알림·시선 같은 자극이 남들보다 크게 들어오는 타입입니다.',
      '이런 타입이 카페나 집에서 몰입하려는 건, 비 오는 운동장에서 100m 기록을 재는 것과 같아요. 기록이 안 나오는 건 다리 탓이 아니라 트랙 탓입니다.',
      '반대로 말하면 — 자극이 차단된 환경에 들어가는 순간, 당신의 몰입력은 가장 크게 튀어 오르는 타입입니다.',
    ],
    solutions: [
      {
        t: '몰입 전 3분 의식 만들기',
        d: '자리에 앉으면 폰을 무음이 아니라 "다른 방"에 두세요. 물리적 거리가 곧 심리적 거리입니다.',
      },
      {
        t: '시간이 아닌 장소로 약속하기',
        d: '"저녁에 해야지"가 아니라 "그 자리에 앉으면 한다"로 바꾸세요. 환경 민감형은 장소 트리거가 가장 강력합니다.',
      },
      {
        t: '한 호흡에 하나만',
        d: '책상 위에 지금 할 것 하나만 남기고 다 치우세요. 시야에 들어오는 모든 것이 당신에겐 알림입니다.',
      },
    ],
    cta: 'space',
    ctaReason:
      '당신에게 필요한 건 프로그램보다 먼저, 자극이 차단된 자리 하나입니다. 커피 한 잔 값으로 하루를 실험해 보세요.',
  },
  peer: {
    key: 'peer',
    emoji: '🔥',
    title: '점화력 좋은 작심삼일 실행가',
    tagline: '시작하는 힘은 충분합니다. 잇는 시스템이 없었을 뿐.',
    analysis: [
      '당신은 결심도 잘하고 시작도 잘합니다. 문제는 3일째부터죠. 이건 게으름이 아니라, 지속을 도와주는 구조가 없다는 뜻입니다.',
      '인간의 의지력은 소모품입니다. 잘하는 사람들은 의지가 강한 게 아니라, 의지가 바닥나도 굴러가는 시스템 — 지켜보는 동료, 정해진 약속, 기록 — 을 가지고 있을 뿐입니다.',
      '당신처럼 점화가 빠른 타입에게 동료와 약속이 붙으면, 가장 멀리 가는 유형이 됩니다.',
    ],
    solutions: [
      {
        t: '결심을 공개로 전환하기',
        d: '혼자 한 결심은 취소해도 아무도 모릅니다. 친구 한 명에게라도 "매일 인증할게"라고 선언하세요. 지켜보는 눈이 곧 지속력입니다.',
      },
      {
        t: '3일째에 미리 약속 심어두기',
        d: '작심삼일이라면, 3일째 되는 날에 누군가와 만날 약속을 미리 잡으세요. 무너지는 지점에 사람을 배치하는 겁니다.',
      },
      {
        t: '완벽한 하루 대신 완전한 10분',
        d: '"오늘 못 했네"로 끊기지 말고, 10분이라도 하면 이어진 걸로 치세요. 연속 기록이 곧 동력입니다.',
      },
    ],
    cta: 'program',
    ctaReason:
      '당신에게 필요한 건 좋은 자리보다 먼저, 끝까지 함께 가는 동료와 약속입니다. 4주만 같이 해보세요.',
  },
  both: {
    key: 'both',
    emoji: '🌪️',
    title: '맨몸으로 버텨온 몰입 난민',
    tagline: '환경도, 동료도 없이 여기까지 온 게 대단한 겁니다.',
    analysis: [
      '진단 결과, 당신은 자극을 막아줄 환경도, 지속을 도와줄 동료도 없이 오직 의지 하나로 버텨온 타입입니다. 지금까지 잘 안 됐던 게 당연합니다.',
      '이 상태에서 "더 열심히"는 답이 아닙니다. 이미 충분히 열심히 하고 있고, 문제는 노력의 양이 아니라 노력이 새는 구멍이니까요.',
      '좋은 소식은 — 환경과 동료, 이 두 가지는 타고나는 게 아니라 구하면 되는 것들입니다. 갖추는 순간 가장 극적으로 변하는 유형이 바로 당신입니다.',
    ],
    solutions: [
      {
        t: '일단 구멍 하나만 막기',
        d: '환경과 지속, 둘 다 한 번에 고치려 하지 마세요. 이번 주는 "자리 하나 확보"만. 다음 주에 "지켜보는 사람 하나"를 더하세요.',
      },
      {
        t: '해야 할 일을 반으로 줄이기',
        d: '리스트가 길수록 아무것도 안 하게 됩니다. 오늘 할 일을 딱 하나로 줄이면, 그 하나는 진짜로 하게 됩니다.',
      },
      {
        t: '무너진 날을 기록하기',
        d: '언제, 어디서, 뭐 때문에 흐트러졌는지 한 줄만 남기세요. 일주일이면 당신의 몰입을 깨는 진짜 범인이 보입니다.',
      },
    ],
    cta: 'program',
    ctaReason:
      '4주 프로그램에는 몰입 공간 자유 이용권이 포함되어 있습니다. 환경과 동료 — 당신에게 없던 두 가지를 한 번에 갖추는 방법입니다.',
  },
  ready: {
    key: 'ready',
    emoji: '🏔️',
    title: '이미 준비된 몰입가',
    tagline: '기본기는 완성. 이제 깊이의 문제입니다.',
    analysis: [
      '드문 타입입니다. 당신은 이미 스스로 몰입에 드는 법을 알고 있고, 환경에도 크게 휘둘리지 않습니다.',
      '다만 이 단계의 함정은 정체입니다. "이 정도면 잘하고 있지"가 계속되면, 어느 순간부터 성장이 아니라 유지만 하게 됩니다.',
      '당신에게 필요한 건 교정이 아니라 상한선을 올리는 자극 — 더 깊은 몰입의 경험과, 비슷한 밀도로 사는 사람들입니다.',
    ],
    solutions: [
      {
        t: '몰입의 질을 기록하기',
        d: '시간이 아니라 깊이를 기록하세요. "오늘 3시간"이 아니라 "오늘 가장 깊었던 30분은 언제였나"를 남기는 겁니다.',
      },
      {
        t: '주 1회, 낯선 자리에서',
        d: '늘 하던 곳은 편하지만 뇌가 자동주행을 합니다. 일주일에 한 번은 새로운 공간에서 가장 어려운 일을 하세요.',
      },
      {
        t: '가르칠 준비를 하기',
        d: '내 몰입 방법을 남에게 설명할 수 있게 정리해 보세요. 정리하는 순간 내 시스템의 빈틈이 보입니다.',
      },
    ],
    cta: 'space',
    ctaReason:
      '당신 정도면 어디서든 하겠지만 — 가장 깊은 30분을 위한 자리는 따로 있습니다. 새벽이든 밤이든, 24시간 열려 있어요.',
  },
}

// env/peer 합산 점수로 유형 결정
export function resolveResult(env: number, peer: number): QuizResult {
  const E = env >= 5
  const P = peer >= 5
  if (E && P) return RESULTS.both
  if (E) return RESULTS.env
  if (P) return RESULTS.peer
  return RESULTS.ready
}

// 각 축의 이론상 최대 점수 (게이지 % 계산용)
export const MAX_SCORES = QUIZ.reduce(
  (acc, q) => {
    acc.env += Math.max(...q.options.map((o) => o.env))
    acc.peer += Math.max(...q.options.map((o) => o.peer))
    return acc
  },
  { env: 0, peer: 0 }
)

// 게이지 수준 라벨
export function gaugeLevel(pct: number): string {
  if (pct >= 70) return '높음'
  if (pct >= 40) return '중간'
  return '낮음'
}
