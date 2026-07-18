// 공간 사진 폴라로이드 마퀴: 살짝 기울어진 폴라로이드 카드들이
// 알록달록한 글로우를 두르고 옆으로 흘러간다.
const PHOTOS = [
  {
    src: '/story/gallery/sign-chair.jpg',
    cap: '몰입, 흐름 그리고 나',
    rot: '-rotate-2',
    glow: '0 12px 32px rgba(231, 111, 81, 0.35)', // coral
  },
  {
    src: '/story/gallery/night-lamp.jpg',
    cap: '저녁의 조명',
    rot: 'rotate-2',
    glow: '0 12px 32px rgba(233, 196, 106, 0.45)', // warm yellow
  },
  {
    src: '/story/gallery/room-window.jpg',
    cap: '오후의 창가',
    rot: '-rotate-1',
    glow: '0 12px 32px rgba(42, 157, 143, 0.35)', // teal
  },
  {
    src: '/story/gallery/alley.jpg',
    cap: '찾아오는 골목',
    rot: 'rotate-3',
    glow: '0 12px 32px rgba(69, 123, 157, 0.35)', // dusty blue
  },
  {
    src: '/story/gallery/desk-chair.jpg',
    cap: '여유 자리',
    rot: '-rotate-3',
    glow: '0 12px 32px rgba(188, 108, 37, 0.35)', // amber wood
  },
  {
    src: '/story/gallery/desk-close.jpg',
    cap: '몰입 책상',
    rot: 'rotate-1',
    glow: '0 12px 32px rgba(204, 35, 102, 0.25)', // pink
  },
]

export default function GalleryMarquee() {
  const items = [...PHOTOS, ...PHOTOS]
  return (
    <div className="relative py-6">
      {/* 알록달록 배경 글로우 블롭 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-8 top-2 w-40 h-40 rounded-full blur-3xl opacity-50 bg-[#f4a261]" />
        <div className="absolute left-1/3 -top-6 w-44 h-44 rounded-full blur-3xl opacity-40 bg-[#e9c46a]" />
        <div className="absolute right-1/4 top-8 w-40 h-40 rounded-full blur-3xl opacity-40 bg-[#2a9d8f]" />
        <div className="absolute -right-8 -top-2 w-44 h-44 rounded-full blur-3xl opacity-35 bg-[#e76f51]" />
      </div>

      <div className="marquee-mask overflow-hidden relative">
        <div className="marquee-track gallery-speed py-4">
          {items.map((p, i) => (
            <figure
              key={`${p.src}-${i}`}
              className={`shrink-0 mr-5 bg-white p-2 pb-3 rounded-xl ${p.rot} transition-transform hover:rotate-0 hover:scale-105 duration-300`}
              style={{ boxShadow: p.glow }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.cap}
                loading="lazy"
                className="w-[150px] h-[190px] object-cover rounded-lg block"
              />
              <figcaption className="text-[11px] text-gray-500 text-center mt-2 tracking-wide">
                {p.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
