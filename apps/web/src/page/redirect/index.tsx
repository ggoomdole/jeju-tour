"use client";

import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";

import type { BaseResponseDTO } from "@/models";
import type { KakaoLoginResponseDTO } from "@/models/auth";
import { clientApi } from "@/services/api";
import { setCookie } from "@/utils/cookie";

import { Loader2 } from "lucide-react";

interface RedirectPageProps {
  code: string;
}

export default function RedirectPage({ code }: RedirectPageProps) {
  useEffect(() => {
    const checkResponse = async () => {
      const response = await clientApi.post<BaseResponseDTO<KakaoLoginResponseDTO>>("login/kakao", {
        code,
      });

      if (response.success) {
        await setCookie("jwtToken", response.data.jwtToken);
        await setCookie("accessToken", response.data.accessToken);
        await setCookie("userId", response.data.userId.toString());

        if (response.data.isFirstLogin) {
          redirect("/signup", RedirectType.replace);
        } else {
          redirect("/home", RedirectType.replace);
        }
      } else {
        redirect("/", RedirectType.replace);
      }
    };
    checkResponse();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-main-900 size-10 animate-spin" />
      <p className="text-main-900 typo-medium">로그인 중...</p>
    </main>
  );
}
