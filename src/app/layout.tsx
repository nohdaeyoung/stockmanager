import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockManager - 내 포트폴리오",
  description: "주가 데이터와 평단가 비교",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
