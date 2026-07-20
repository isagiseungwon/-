import BookingForm from './components/BookingForm'
import ApplyForm from './components/ApplyForm'
import Reveal from './components/Reveal'
import InstaMarquee from './components/InstaMarquee'
import GalleryMarquee from './components/GalleryMarquee'
import StickyCTA from './components/StickyCTA'
import { PROGRAM, PROGRAM_INCLUDES, CURRICULUM } from '@/lib/program'

export default function HomePage() {
  return (
    <main className="text-[#1a1a2e]">
      <StickyCTA />

      {/* ───────── Hero: 4주 프로그램 1기 모집 ───────── */}
      <section className="relative px-6 pt-24 pb-20 overflow-hidden">
        {/* 은은한 글로우 */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25 bg-[#e9c46a]" />
          <div className="absolute -left-20 top-40 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#2a9d8f]" />
          <div className="absolute -right-16 top-24 w-56 h-56 rounded-full blur-3xl opacity-20 bg-[#e76f51]" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <Reveal>
            <div className="text-3xl mb-8">🌿</div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e76f51]/40 bg-[#e76f51]/[0.07] px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e76f51] animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-[#e76f51]">
                {PROGRAM.cohort} 모집 중 · {PROGRAM.seatsTotal}명 한정
              </span>
            </div>
            <h1 className="serif text-[2.4rem] leading-[1.3] font-semibold tracking-tight mb-6">
              요청을 현실로<br />만드는 4주
            </h1>
            <p className="text-[17px] leading-[1.8] text-[#1a1a2e] font-medium mb-3">
              혼자서는 4주를 못 버티니까,<br />같이 합니다.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-500 mb-10">
              쌍문 몰입 공간에서 진행하는<br />
              소수 정원 오프라인 프로그램
            </p>
            <a
              href="#apply"
              className="inline-block px-8 py-3.5 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2d2d4e] transition"
            >
              {PROGRAM.cohort} 신청하기
            </a>
            <div className="mt-6">
              <a
                href="#booking"
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 tracking-wide"
              >
                공간만 이용하고 싶다면 →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[60px] mx-auto border-t border-gray-200" />

      {/* ───────── 문제 제기 ───────── */}
      <section className="px-6 py-20 max-w-xl mx-auto text-center">
        <Reveal>
          <p className="text-[17px] leading-[1.9] text-[#1a1a2e] font-medium">
            자기계발 콘텐츠는 넘치는데,<br />
            왜 실행은 안 될까요?
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[15px] leading-[2.1] text-gray-500 mt-8">
            의지가 부족해서가 아닙니다.<br />
            <span className="text-[#1a1a2e]">환경과 동료</span>가 없었을 뿐.
          </p>
        </Reveal>
      </section>

      {/* ───────── 프로그램 소개: 무엇을 하나요 ───────── */}
      <section className="px-6 py-20 bg-white border-y border-gray-100">
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
                d: '쌍문 몰입 공간에서, 총 4회. 같은 목표를 가진 사람들과 한 공간에서 몰입합니다.',
              },
              {
                n: '②',
                t: '매일 단톡방 실행 인증 & 피드백',
                d: '작은 실행이라도 매일 남기고, 서로 확인합니다. 혼자가 아니라서 이어집니다.',
              },
              {
                n: '③',
                t: '몰입 노션 시스템 제공',
                d: '무엇을 언제 할지 흩어지지 않게, 검증된 노션 템플릿을 그대로 드립니다.',
              },
            ].map((c, i) => (
              <Reveal key={c.n} delay={i * 120}>
                <div className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-[#f8f7f4] p-5">
                  <div className="serif text-2xl text-[#2a9d8f] leading-none shrink-0">
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

      {/* ───────── 4주 커리큘럼 (세로 타임라인) ───────── */}
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
            {/* 세로 라인 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" aria-hidden />
            <div className="space-y-10">
              {CURRICULUM.map((w, i) => (
                <Reveal key={w.week} delay={i * 100}>
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#2a9d8f] bg-[#f8f7f4]" />
                    <p className="text-xs tracking-wide text-[#2a9d8f] font-semibold mb-1">
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
            <div className="mt-16 rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
                이런 분께
              </p>
              <p className="text-[15px] leading-[1.9] text-[#1a1a2e]">
                자기계발 콘텐츠를 <span className="text-gray-400">소비만</span> 하다가,<br />
                <span className="font-semibold">실행이 안 되는 분</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── 가격 ───────── */}
      <section className="px-6 py-20 bg-[#12122a] text-white">
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
                  <span className="text-[#2a9d8f] shrink-0">✓</span>
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
                className="inline-block px-8 py-3.5 rounded-full bg-white text-[#1a1a2e] text-sm font-semibold hover:bg-gray-100 transition"
              >
                {PROGRAM.cohort} 신청하기
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── 신청 폼 ───────── */}
      <section id="apply" className="px-6 py-20 scroll-mt-4">
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
      <section className="px-6 py-20 bg-white border-y border-gray-100">
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
                  a: '네! 프로그램과 별개로 24시간 이용권(4,500원)으로 몰입 공간만 이용하실 수 있어요. 아래 예약 섹션에서 신청하시면 됩니다.',
                },
                {
                  q: '혼자 가도 어색하지 않을까요?',
                  a: '각자의 몰입을 존중하는 조용한 분위기라 오히려 혼자일 때 가장 편안합니다. 프로그램은 같은 목표를 가진 소수와 함께라 더 편하게 이어져요.',
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

      {/* ───────── 인스타그램 쇼케이스 ───────── */}
      <section className="py-20 bg-[#12122a] text-white overflow-hidden">
        <div className="px-6 max-w-md mx-auto text-center mb-10">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-6">
              Instagram
            </p>
            <h2 className="serif text-xl font-medium tracking-tight mb-4 leading-relaxed">
              이 공간의 이야기를<br />
              함께 보고 있습니다
            </h2>
            <p className="text-sm text-white/50">@macha_ver._ · 이상한 마차</p>
          </Reveal>
        </div>

        <Reveal>
          <InstaMarquee />
        </Reveal>

        <div className="text-center mt-10 px-6">
          <Reveal>
            <p className="text-xs text-white/40 mb-6">
              카드를 누르면 인스타그램으로 이동해요
            </p>
            <a
              href="https://www.instagram.com/macha_ver._"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-full text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background:
                  'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              }}
            >
              📷 인스타그램 보러가기
            </a>
          </Reveal>
        </div>
      </section>

      {/* ───────── 유튜브: 마차 이야기 ───────── */}
      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
              Video
            </p>
            <h2 className="serif text-xl font-medium tracking-tight mb-4">
              마차가 더 궁금하다면
            </h2>
            <p className="text-sm text-gray-500 mb-10">
              이 공간을 만든 사람의 이야기를 영상으로 만나보세요
            </p>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-[0_12px_40px_rgba(26,26,46,0.15)]">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Kur0FCStKLo"
                title="몰입, 흐름 그리고 나 — 마차 이야기"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ 이하: 공간 대여(서브) ═════════ */}

      {/* ───────── 공간 & 위치 ───────── */}
      <section className="py-20 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-md mx-auto text-center px-6">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-2">
              Space
            </p>
            <h2 className="serif text-xl font-medium tracking-tight mb-3">
              프로그램이 진행되는 공간
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              24시간 이용권 4,500원으로 따로 이용할 수도 있어요
            </p>
          </Reveal>
        </div>

        {/* 공간 갤러리: 폴라로이드 마퀴 (풀폭) */}
        <Reveal>
          <GalleryMarquee />
        </Reveal>

        <div className="max-w-md mx-auto text-center px-6 mt-8">
          <Reveal>
            <p className="text-[15px] leading-[1.9] text-gray-600 mb-6">
              〈몰입, 흐름 그리고 나〉는<br />
              <span className="text-[#1a1a2e] font-medium">쌍문역 3번 출구</span>에서 도보 8분,<br />
              조용한 골목에 있습니다.
            </p>

            {/* 이용 안내 카드 */}
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
                  <span>서울 도봉구 도봉로103길 23-13 B02호</span>
                </li>
              </ul>
            </div>

            {/* 연락/길찾기 버튼 */}
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

            {/* 네이버 리뷰 */}
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

      {/* ───────── 공간 예약 폼 (서브) ───────── */}
      <section id="booking" className="px-6 py-20 scroll-mt-4">
        <div className="max-w-md mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                공간만 이용하기
              </p>
              <h2 className="serif text-xl font-medium tracking-tight mb-4">
                24시간 이용권<br />4,500원
              </h2>
              <p className="text-sm text-gray-500">
                프로그램 없이, 몰입 공간만 이용하고 싶다면
              </p>
            </div>
          </Reveal>
          <BookingForm />
          <p className="text-center text-xs text-gray-400 mt-8">
            결제 후 입실 시간이 확정됩니다
          </p>
        </div>
      </section>

      {/* ───────── 푸터 ───────── */}
      <footer className="px-6 py-12 text-center border-t border-gray-100 bg-white">
        <div className="text-base mb-3">🌿</div>
        <p className="text-sm font-medium mb-3">몰입, 흐름 그리고 나</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-1">
          서울 도봉구 도봉로103길 23-13 B02호 · 쌍문역 3번 출구 도보 8분
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mb-1">
          24시간 영업 · 연중무휴 ·{' '}
          <a href="tel:0507-1348-9410" className="underline">0507-1348-9410</a>
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          <a
            href="https://www.instagram.com/macha_ver._"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            📷 @macha_ver._
          </a>
        </p>
        <p className="text-xs text-gray-300">
          <a href="/admin" className="underline">관리자</a>
        </p>
      </footer>
    </main>
  )
}
