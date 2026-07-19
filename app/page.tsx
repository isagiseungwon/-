import BookingForm from './components/BookingForm'
import Reveal from './components/Reveal'
import InstaMarquee from './components/InstaMarquee'
import CountUp from './components/CountUp'
import GalleryMarquee from './components/GalleryMarquee'
import StickyCTA from './components/StickyCTA'

export default function HomePage() {
  return (
    <main className="text-[#1a1a2e]">
      <StickyCTA />
      {/* ───────── Hero ───────── */}
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
          <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-6">
            시간 단위 몰입 공간
          </p>
          <h1 className="serif text-[2.4rem] leading-[1.3] font-semibold tracking-tight mb-6">
            몰입, 흐름<br />그리고 나
          </h1>
          <p className="text-[17px] leading-[1.8] text-[#1a1a2e] font-medium mb-3">
            오늘, 3분 이상<br />무언가에 집중해 본 적 있나요?
          </p>
          <p className="text-[15px] leading-relaxed text-gray-500 mb-10">
            알림도, 시선도 없는 곳에서<br />
            온전히 나에게 집중하는 시간
          </p>
          <a
            href="#booking"
            className="inline-block px-8 py-3.5 rounded-full bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2d2d4e] transition"
          >
            예약하기
          </a>
          <p className="text-xs text-gray-400 mt-6 tracking-wide">
            24시간 영업 · 음료와 간식 무료 · 쌍문역 3번 출구
          </p>
        </Reveal>
        </div>
      </section>

      <div className="max-w-[60px] mx-auto border-t border-gray-200" />

      {/* ───────── 공감 (문제 제기) ───────── */}
      <section className="px-6 py-20 max-w-xl mx-auto text-center">
        <Reveal>
          <p className="text-[15px] leading-[2.1] text-gray-600">
            해야 할 일을 펼쳐 놓고도<br />
            5분마다 폰을 집어 들고,
          </p>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-[15px] leading-[2.1] text-gray-600 mt-8">
            카페에 가면 소음과 시선에,<br />
            집에 있으면 침대의 유혹에 무너지고.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-[15px] leading-[2.1] text-[#1a1a2e] font-medium mt-8">
            의지가 약해서가 아닙니다.<br />
            몰입할 수 있는 <u className="underline-offset-4">환경</u>이 없었을 뿐.
          </p>
        </Reveal>
      </section>

      {/* ───────── 해결책 (컨셉) ───────── */}
      <section className="px-6 py-20 bg-white border-y border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="serif text-xl font-medium mb-5 tracking-tight">
              그래서, 환경을 만들었습니다
            </h2>
            <p className="text-[15px] leading-[1.9] text-gray-500">
              흩어진 생각을 하나로 모으는 일에는<br />
              방해받지 않는 시간과 공간이 필요합니다.<br />
              잠시 머물며, 오롯이 몰입해 보세요.
            </p>
            <p className="text-[15px] leading-[1.9] text-gray-500 mt-6">
              일기, 독서, 생각 정리, 아이디어 —<br />
              무엇이든 좋습니다.{' '}
              <span className="text-[#1a1a2e] font-medium">
                한 호흡에 하나만.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── 브랜드 스토리: 시간을 비싸게 쓰는 법 ───────── */}
      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
              Essay
            </p>
            <h2 className="serif text-xl font-medium text-center mb-14 tracking-tight">
              시간을 비싸게 쓰는 법
            </h2>
          </Reveal>

          <div className="space-y-14 text-center">
            <Reveal>
              <p className="text-[15px] leading-[2] text-gray-600">
                일기를 쓰든, 오늘의 생각을 적든,<br />
                흩어진 아이디어를 정리하든, 책을 훑어보든 —<br />
                <span className="text-[#1a1a2e]">
                  그 순간부터 시간은 느리고 여유롭게 흐릅니다.
                </span>
              </p>
            </Reveal>

            <div className="max-w-[40px] mx-auto border-t border-gray-200" />

            <Reveal>
              <p className="text-[15px] leading-[2] text-gray-600">
                오로지 한 호흡에 하나를 몰입할 수 있는,<br />
                <span className="text-[#1a1a2e] font-medium">
                  누구도 값을 매길 수 없는 럭셔리한 시간.
                </span>
              </p>
            </Reveal>

            <div className="max-w-[40px] mx-auto border-t border-gray-200" />

            <Reveal>
              <p className="text-[15px] leading-[2] text-gray-600">
                디지털과 멀어진 시간이지만,<br />
                아이러니하게도 본질을 꿰뚫으며<br />
                나를 더 잘 살게 하는 세련된 시야로<br />
                변모하게 하는 시간입니다.
              </p>
            </Reveal>
          </div>

          <Reveal>
            <blockquote className="mt-16 text-center">
              <p className="serif text-lg font-medium leading-relaxed tracking-tight text-[#1a1a2e]">
                &ldquo;오늘, 내가 할 수 있는<br />의도적 몰입은 무엇인가?&rdquo;
              </p>
            </blockquote>
            <div className="text-center mt-10">
              <a
                href="#booking"
                className="inline-block px-8 py-3.5 rounded-full border border-[#1a1a2e] text-[#1a1a2e] text-sm font-medium hover:bg-[#1a1a2e] hover:text-white transition"
              >
                커피 한 잔 값으로 시작하기
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── 이용 방법 ───────── */}
      <section className="px-6 py-16">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-12">
              이용 방법
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: '01', t: '시간 선택', d: '원하는 날짜와\n시간을 고르고' },
              { n: '02', t: '간편 결제', d: '카드·간편결제로\n바로 예약' },
              { n: '03', t: '입실', d: '예약한 시간에\n방문하면 끝' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="text-sm text-gray-300 mb-3 font-medium">{s.n}</div>
                <div className="text-[15px] font-medium mb-2">{s.t}</div>
                <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                  {s.d}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 특징 ───────── */}
      <section className="px-6 pb-4 pt-8 max-w-xl mx-auto">
        <div className="space-y-10">
          {[
            { t: '온전한 고요', d: '방해 없는 환경에서 깊이 몰입할 수 있어요.' },
            { t: '합리적인 가격', d: '커피 한 잔 값으로 누리는 나만의 시간.' },
            { t: '편한 방문', d: '예약 없이도, 혼자 또는 단둘이 오셔도 좋아요.' },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 120}>
              <div className="flex gap-5 items-start">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1a1a2e] shrink-0" />
                <div>
                  <h3 className="text-[15px] font-medium mb-1.5">{f.t}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── 공간 & 위치 ───────── */}
      <section className="py-20 mt-8 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-md mx-auto text-center px-6">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-2">
              Space
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
            <p className="text-sm leading-relaxed text-gray-500 mb-10">
              혼자, 혹은 친구와 단둘이 오셔서<br />
              평온한 럭셔리를 누리시길 바라요.
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
                  <span>음료와 간식 <strong className="text-[#1a1a2e] font-medium">무료</strong></span>
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
          </Reveal>
        </div>
      </section>

      {/* ───────── 인스타그램 쇼케이스 ───────── */}
      <section className="py-20 bg-[#12122a] text-white overflow-hidden">
        {/* 초대형 숫자 블록 */}
        <div className="px-6 max-w-md mx-auto text-center mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-10">
              숫자로 보는 이 공간
            </p>
            <div className="space-y-10">
              <div>
                <p className="text-sm text-white/50 mb-2">함께 보는 사람들</p>
                <p className="serif text-5xl font-bold tracking-tight">
                  <CountUp to={13000} />
                  <span className="text-[#e9c46a]">+</span>
                </p>
              </div>
              <div className="max-w-[80px] mx-auto border-t border-dotted border-white/20" />
              <div>
                <p className="text-sm text-white/50 mb-2">쌓인 공간의 기록</p>
                <p className="serif text-5xl font-bold tracking-tight">
                  <CountUp to={1290} />
                  <span className="text-[#e9c46a]">+</span>
                </p>
              </div>
              <div className="max-w-[80px] mx-auto border-t border-dotted border-white/20" />
              <div>
                <p className="text-sm text-white/50 mb-2">언제든 열려있는 시간</p>
                <p className="serif text-5xl font-bold tracking-tight">
                  <CountUp to={24} />
                  <span className="text-[#e9c46a]">h</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

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
                  q: '어떤 걸 하는 공간인가요?',
                  a: '일기 쓰기, 독서, 생각 정리, 아이디어 스케치 — 무엇이든 좋아요. 오로지 한 호흡에 하나에 몰입할 수 있도록 조용한 환경을 준비했습니다.',
                },
                {
                  q: '예약 없이 방문해도 되나요?',
                  a: '네! 예약 없이 편히 방문하실 수 있어요. 다만 자리를 확실히 보장받고 싶다면 미리 예약을 추천드려요.',
                },
                {
                  q: '음료나 간식을 가져가야 하나요?',
                  a: '아니요, 음료와 간식이 무료로 준비되어 있어요. 편하게 몸만 오세요.',
                },
                {
                  q: '중간에 나갔다 와도 되나요?',
                  a: '네, 이용 시간 내 자유로운 외출과 출입이 가능합니다.',
                },
                {
                  q: '혼자 가도 어색하지 않을까요?',
                  a: '혼자 오시는 분들을 위해 만든 공간이에요. 각자의 몰입을 존중하는 조용한 분위기라 오히려 혼자일 때 가장 편안합니다. 친구와 단둘이 오셔도 좋아요.',
                },
                {
                  q: '몇 시까지 하나요?',
                  a: '24시간, 연중무휴로 운영됩니다. 새벽의 고요함이 필요할 때도 언제든 오세요.',
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-gray-100 bg-[#f8f7f4] overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-4.5 cursor-pointer list-none text-[15px] font-medium text-[#1a1a2e] py-4">
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

      {/* ───────── 예약 폼 ───────── */}
      <section id="booking" className="px-6 py-20 scroll-mt-4">
        <div className="max-w-md mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                예약하기
              </p>
              <h2 className="serif text-xl font-medium tracking-tight mb-4">
                오늘, 한 시간만<br />나에게 선물하세요
              </h2>
              <p className="text-sm text-gray-500">
                커피 한 잔 값이면 충분합니다
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
