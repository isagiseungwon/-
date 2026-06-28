import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "몰입공간 | 나만의 집중 공간",
  description: "방해 없이 생각을 정리할 수 있는 공간. 1시간 3,000원 / 2시간 5,000원",
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
