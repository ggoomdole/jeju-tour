import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import RootProvider from "@/components/provider/root-provider";
import ScriptProvider from "@/components/provider/script-provider";
import ThirdPartiesProvider from "@/components/provider/third-parties-provider";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "순례해유",
  description: "나만의 대전 순례길을 만들고 다른 사람들과 공유하세요.",
  openGraph: {
    title: "순례해유",
    description: "나만의 대전 순례길을 만들고 다른 사람들과 공유하세요.",
    images: "/og-image.png",
    url: "https://ggoomdole.kro.kr/",
    siteName: "순례해유",
    locale: "ko_KR",
    type: "website",
  },
  keywords: [
    "순례해유",
    "순례길",
    "순례",
    "대전 순례길",
    "대전 순례",
    "여행",
    "대전 여행",
    "대전 여행 코스",
    "대전 여행 코스 추천",
    "대전 여행 코스 추천 사이트",
  ],
  applicationName: "순례해유",
  alternates: {
    canonical: "https://ggoomdole.kro.kr/",
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
        <ThirdPartiesProvider />
      </body>
    </html>
  );
}
