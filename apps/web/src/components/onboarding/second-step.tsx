"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button";

const step2 = "/static/onboarding/step2.png";

export default function SecondStep() {
  const router = useRouter();

  const onClickNext = () => {
    router.push("?step=3");
  };

  return (
    <section className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <Image src={step2} alt="두 번째 스텝 꿈돌이" width={300} height={300} />
        <div className="space-y-2.5">
          <h1 className="typo-bold text-center">
            순례길에 참여하여
            <br />
            기록을 남기세요
          </h1>
          <p className="typo-medium text-center">당신의 발자취를 남기세요</p>
        </div>
      </div>
      <Button className="mx-7.5 mb-10 mt-2.5" onClick={onClickNext}>
        다음
      </Button>
    </section>
  );
}
