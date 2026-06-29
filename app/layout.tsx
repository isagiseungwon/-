import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "몰입, 흐름 그리고 나 | 시간 단위 몰입 공간",
  description: "방해받지 않고 온전히 나에게 집중하는 시간. 1시간 3,000원 / 2시간 5,000원",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f8f7f4] text-[#1a1a2e]">
        {children}
      </body>
    </html>
  );
}
