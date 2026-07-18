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
  title: "몰입, 흐름 그리고 나 | 쌍문역 24시간 몰입 공간",
  description:
    "방해받지 않고 온전히 나에게 집중하는 시간. 쌍문역 3번 출구 도보 8분, 24시간 연중무휴, 음료·간식 무료. 1시간 3,000원 / 2시간 5,000원",
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
