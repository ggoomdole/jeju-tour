import React from "react";
import Image from "next/image";
import Link from "next/link";

const notFoundImage = "/static/onboarding/step3.png";

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Image src={notFoundImage} alt="not-found" width={300} height={300} />
      <h1 className="typo-bold text-main-900">잘못된 경로</h1>
      <p className="typo-semibold">페이지를 찾을 수 없어요.</p>
      <Link
        replace
        href="/home"
        className="from-main-700 to-main-900 typo-semibold max-w-mobile mt-10 w-[90vw] rounded-xl bg-gradient-to-r py-5 text-center text-white"
      >
        홈으로 가기
      </Link>
    </main>
  );
}
