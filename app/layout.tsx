import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-kr",
  display: "swap",
});

const serifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hellkang.vercel.app"),
  title: "요청을 현실로 만드는 4주 | 1기 모집",
  description:
    "혼자서는 4주를 못 버티니까, 같이 합니다. 쌍문 몰입 공간에서 진행하는 소수 정원 오프라인 프로그램. 주 1회 오프라인 세션 + 매일 단톡 실행 인증 + 몰입 노션 시스템. 1기 8명 한정 모집 중.",
  openGraph: {
    type: "website",
    title: "요청을 현실로 만드는 4주 | 1기 모집",
    description:
      "혼자서는 4주를 못 버티니까, 같이 합니다. 쌍문 몰입 공간에서 진행하는 소수 정원 오프라인 프로그램 · 1기 8명 한정.",
    siteName: "몰입, 흐름 그리고 나",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "요청을 현실로 만드는 4주 | 1기 모집",
    description:
      "혼자서는 4주를 못 버티니까, 같이 합니다. 쌍문 몰입 공간 소수 정원 오프라인 프로그램 · 1기 8명 한정.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${sansKr.variable} ${serifKr.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f8f7f4] text-[#1a1a2e]">
        {children}
      </body>
    </html>
  );
}
