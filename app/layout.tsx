import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "교실 미션 해결사",
  description: "초등학교 교사 및 학생을 위한 미션 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

