const INSTA_URL = 'https://www.instagram.com/macha_ver._'

const CARDS = [
  { src: '/story/insta/findway.jpg', alt: '찾아오는 법' },
  { src: '/story/insta/expensive.jpg', alt: '시간을 비싸게 쓰는 법' },
  { src: '/story/insta/space.jpg', alt: '공간 소개' },
  { src: '/story/insta/essay1.jpg', alt: '몰입 에세이 1' },
  { src: '/story/insta/seat.jpg', alt: '여유 자리' },
  { src: '/story/insta/essay2.jpg', alt: '몰입 에세이 2' },
  { src: '/story/insta/essay3.jpg', alt: '몰입 에세이 3' },
]

function Row({ reverse = false }: { reverse?: boolean }) {
  // 무한 루프를 위해 동일 세트를 2번 렌더 → -50% 이동 시 이어짐
  const items = [...CARDS, ...CARDS]
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {items.map((c, i) => (
          <a
            key={`${c.src}-${i}`}
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block shrink-0 w-[140px] mr-3 rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-colors"
            aria-label={`인스타그램 게시물: ${c.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.alt}
              className="w-full h-[175px] object-cover object-top block"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default function InstaMarquee() {
  return (
    <div className="space-y-3">
      <Row />
      <Row reverse />
    </div>
  )
}
