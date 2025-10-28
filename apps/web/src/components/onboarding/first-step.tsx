"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button";

const step1 = "/static/onboarding/step1.png";

export default function FirstStep() {
  const router = useRouter();

  const onClickNext = () => {
    router.push("?step=2");
  };

  return (
    <section className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <Image src={step1} alt="첫 번째 스텝 꿈돌이" width={300} height={300} />
        <div className="space-y-2.5">
          <h1 className="typo-bold text-center">
            순례길의 대장이
            <br />
            되어보세요
          </h1>
          <p className="typo-medium text-center">대전을 여행하는 새로운 방법</p>
        </div>
      </div>
      <Button className="mx-7.5 mb-10 mt-2.5" onClick={onClickNext}>
        다음
      </Button>
    </section>
  );
}
