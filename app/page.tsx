import BookingForm from './components/BookingForm'

export default function HomePage() {
  return (
    <main className="text-[#1a1a2e]">
      {/* ───────── Hero ───────── */}
      <section className="px-6 pt-24 pb-20 max-w-xl mx-auto text-center">
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
      </section>

      {/* 얇은 구분선 */}
      <div className="max-w-[60px] mx-auto border-t border-gray-200" />

      {/* ───────── 컨셉 ───────── */}
      <section className="px-6 py-20 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-medium mb-5 tracking-tight">생각이 흐르도록</h2>
        <p className="text-[15px] leading-[1.9] text-gray-500">
          흩어진 생각을 하나로 모으는 일에는<br />
          방해받지 않는 시간과 공간이 필요합니다.<br />
          잠시 머물며, 오롯이 몰입해 보세요.
        </p>
      </section>

      {/* ───────── 이용 방법 ───────── */}
      <section className="px-6 py-16 bg-white border-y border-gray-100">
        <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase text-center mb-12">
            이용 방법
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: '01', t: '시간 선택', d: '원하는 날짜와\n시간을 고르고' },
              { n: '02', t: '간편 결제', d: '카드·간편결제로\n바로 예약' },
              { n: '03', t: '입실', d: '예약한 시간에\n방문하면 끝' },
            ].map((s) => (
              <div key={s.n}>
                <div className="text-sm text-gray-300 mb-3 font-medium">{s.n}</div>
                <div className="text-[15px] font-medium mb-2">{s.t}</div>
                <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 특징 ───────── */}
      <section className="px-6 py-20 max-w-xl mx-auto">
        <div className="space-y-10">
          {[
            { t: '온전한 고요', d: '방해 없는 환경에서 깊이 몰입할 수 있어요.' },
            { t: '합리적인 가격', d: '커피 한 잔 값으로 누리는 나만의 시간.' },
            { t: '1분 예약', d: '복잡한 절차 없이 폰으로 바로 예약하세요.' },
          ].map((f) => (
            <div key={f.t} className="flex gap-5 items-start">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1a1a2e] shrink-0" />
              <div>
                <h3 className="text-[15px] font-medium mb-1.5">{f.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── 예약 폼 ───────── */}
      <section id="booking" className="px-6 py-20 bg-white border-t border-gray-100 scroll-mt-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
              예약하기
            </p>
            <h2 className="text-xl font-medium tracking-tight">
              지금 시간을 예약하세요
            </h2>
          </div>
          <BookingForm />
          <p className="text-center text-xs text-gray-400 mt-8">
            결제 후 입실 시간이 확정됩니다
          </p>
        </div>
      </section>

      {/* ───────── 푸터 ───────── */}
      <footer className="px-6 py-10 text-center border-t border-gray-100">
        <div className="text-base mb-3">🌿</div>
        <p className="text-sm font-medium mb-1">몰입, 흐름 그리고 나</p>
        <p className="text-xs text-gray-400">
          시간 단위 몰입 공간 · <a href="/admin" className="underline">관리자</a>
        </p>
      </footer>
    </main>
  )
}
