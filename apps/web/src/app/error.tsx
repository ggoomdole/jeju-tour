"use client";

import Image from "next/image";
import Link from "next/link";

const errorImage = "/static/error.png";

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  console.error("Error", error);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Image src={errorImage} alt="error" width={300} height={300} />
      <h1 className="typo-bold text-main-900">서버 오류</h1>
      <p className="typo-semibold">예상치 못한 오류가 발생했어요.</p>
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
