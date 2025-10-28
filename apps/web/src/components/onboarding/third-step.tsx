"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button";

const step3 = "/static/onboarding/step3.png";

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

export default function ThirdStep() {
  const router = useRouter();

  const onRouteToHome = () => {
    router.push("/home");
  };

  const onKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  };

  return (
    <section className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <Image src={step3} alt="세 번째 스텝 꿈돌이" width={300} height={300} />
        <div className="space-y-2.5">
          <h1 className="typo-bold text-center">
            다함께 만들어가는
            <br />
            순례길
          </h1>
          <p className="typo-medium text-center">좋아요와 후기로 길을 완성해요</p>
        </div>
      </div>
      <div className="mx-7.5 mb-10 mt-2.5 flex gap-3">
        <Button
          className="border-main-700 text-foreground flex-1 border-2 bg-gradient-to-r from-white to-white"
          onClick={onRouteToHome}
        >
          둘러보기
        </Button>
        <Button className="flex-1" onClick={onKakaoLogin}>
          회원가입
        </Button>
      </div>
    </section>
  );
}
