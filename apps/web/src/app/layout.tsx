import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import RootProvider from "@/components/provider/root-provider";
import ScriptProvider from "@/components/provider/script-provider";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "순례합서",
  description: "나만의 제주도 순례길을 만들고 다른 사람들과 공유하세요.",
  openGraph: {
    title: "순례합서",
    description: "나만의 제주도 순례길을 만들고 다른 사람들과 공유하세요.",
    images: "/og-image.png",
    url: "https://halbange.kro.kr/",
    siteName: "순례합서",
    locale: "ko_KR",
    type: "website",
  },
  keywords: [
    "순례합서",
    "순례길",
    "순례",
    "제주도 순례길",
    "제주도 순례",
    "여행",
    "제주도 여행",
    "제주도 여행 코스",
    "제주도 여행 코스 추천",
    "제주도 여행 코스 추천 사이트",
  ],
  applicationName: "순례합서",
  alternates: {
    canonical: "https://halbange.kro.kr/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <ScriptProvider />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
