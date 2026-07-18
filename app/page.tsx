import BookingForm from './components/BookingForm'
import Reveal from './components/Reveal'

export default function HomePage() {
  return (
    <main className="text-[#1a1a2e]">
      {/* ───────── Hero ───────── */}
      <section className="px-6 pt-24 pb-20 max-w-xl mx-auto text-center">
        <Reveal>
          <div className="text-3xl mb-8">🌿</div>
          <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-6">
            시간 단위 몰입 공간
          </p>
          <h1 className="text-[2rem] leading-[1.35] font-semibold tracking-tight mb-6">
            몰입, 흐름<br />그리고 나
          </h1>
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
      </section>

      <div className="max-w-[60px] mx-auto border-t border-gray-200" />

      {/* ───────── 컨셉 ───────── */}
      <section className="px-6 py-20 max-w-xl mx-auto text-center">
        <Reveal>
          <h2 className="text-xl font-medium mb-5 tracking-tight">생각이 흐르도록</h2>
          <p className="text-[15px] leading-[1.9] text-gray-500">
            흩어진 생각을 하나로 모으는 일에는<br />
            방해받지 않는 시간과 공간이 필요합니다.<br />
            잠시 머물며, 오롯이 몰입해 보세요.
          </p>
        </Reveal>
      </section>

      {/* ───────── 브랜드 스토리: 시간을 비싸게 쓰는 법 ───────── */}
      <section className="px-6 py-20 bg-white border-y border-gray-100">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-3">
              Essay
            </p>
            <h2 className="text-xl font-medium text-center mb-14 tracking-tight">
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
              <p className="text-lg font-medium leading-relaxed tracking-tight text-[#1a1a2e]">
                &ldquo;오늘, 내가 할 수 있는<br />의도적 몰입은 무엇인가?&rdquo;
              </p>
            </blockquote>
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
      <section className="px-6 py-20 mt-8 bg-white border-y border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-6">
              Space
            </p>
            <div className="overflow-hidden rounded-2xl mb-8 border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/story/room.jpg"
                alt="몰입, 흐름 그리고 나 공간 내부"
                className="w-full h-auto block"
              />
            </div>
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

      {/* ───────── 예약 폼 ───────── */}
      <section id="booking" className="px-6 py-20 scroll-mt-4">
        <div className="max-w-md mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                예약하기
              </p>
              <h2 className="text-xl font-medium tracking-tight">
                지금 시간을 예약하세요
              </h2>
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
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          24시간 영업 · 연중무휴 ·{' '}
          <a href="tel:0507-1348-9410" className="underline">0507-1348-9410</a>
        </p>
        <p className="text-xs text-gray-300">
          <a href="/admin" className="underline">관리자</a>
        </p>
      </footer>
    </main>
  )
}
