import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: {
    default: "몰입, 흐름 그리고 나 | 쌍문 몰입 브랜드",
    template: "%s | 몰입, 흐름 그리고 나",
  },
  description:
    "온전히 나에게 집중하는 시간을 위한 브랜드. 쌍문 몰입 공간에서 24시간 공간 대여와 4주 오프라인 프로그램을 운영합니다.",
  openGraph: {
    type: "website",
    title: "몰입, 흐름 그리고 나",
    description:
      "온전히 나에게 집중하는 시간. 쌍문 몰입 공간의 24시간 공간 대여와 4주 프로그램.",
    siteName: "몰입, 흐름 그리고 나",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "몰입, 흐름 그리고 나",
    description:
      "온전히 나에게 집중하는 시간. 쌍문 몰입 공간의 24시간 공간 대여와 4주 프로그램.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${sansKr.variable} ${serifKr.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f3ece1] text-[#3b2e21]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
