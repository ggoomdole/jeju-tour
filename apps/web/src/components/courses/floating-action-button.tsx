"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Folder from "@/assets/folder.svg";
import Enter from "@/assets/login.svg";
import More from "@/assets/more.svg";
import Send from "@/assets/send.svg";
import { useParticipateRoad, useWithdrawRoad } from "@/lib/tanstack/mutation/road";
import { cn } from "@/lib/utils";
import { getCookie } from "@/utils/cookie";
import { infoToast } from "@/utils/toast";

interface FloatingActionButtonProps {
  id: string;
  isParticipate: boolean;
}

export default function FloatingActionButton({ id, isParticipate }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: participateRoad } = useParticipateRoad();
  const { mutateAsync: withdrawRoad } = useWithdrawRoad();

  const ACTION_BUTTONS = [
    {
      icon: Enter,
      text: isParticipate ? "순례길 나가기" : "순례길 참여하기",
      value: "participate" as const,
    },
    {
      icon: Send,
      text: "장소 추가 요청하기",
      value: "request" as const,
    },
    {
      icon: Folder,
      text: "나만의 순례길로 가져오기",
      value: "my-course" as const,
    },
  ];

  const onClick = async (value: (typeof ACTION_BUTTONS)[number]["value"]) => {
    const isTokenExistd = !!(await getCookie("jwtToken"));
    if (!isTokenExistd) return infoToast("로그인 후 이용해주세요.");

    if (value === "request") {
      router.push(`/courses/${id}/request`);
    } else if (value === "my-course") {
      router.push(`/courses/upload?id=${id}&view=duplicate`);
    } else if (value === "participate") {
      if (isParticipate) {
        await withdrawRoad(id);
      } else {
        await participateRoad(id);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-[calc(var(--spacing-navigation)+1.25rem)] mr-5 self-end">
      <button
        className="bg-main-100 text-main-900 shadow-floating-action-button relative z-10 rounded-full p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <More />
      </button>
      <div className="absolute top-0 flex w-full flex-col items-end gap-2 pr-2">
        {ACTION_BUTTONS.map((button, index) => (
          <div
            key={button.text}
            className={cn(
              "pointer-events-none absolute top-0 flex items-center gap-2 opacity-0 transition-all duration-300",
              isOpen && "pointer-events-auto opacity-100"
            )}
            style={{
              transform: isOpen
                ? `translateY(calc(-100% - ${(ACTION_BUTTONS.length - 1 - index) * 48 + 8}px)`
                : "translateY(0px)",
              transitionDelay: isOpen
                ? `${index * 100}ms`
                : `${(ACTION_BUTTONS.length - 1 - index) * 100}ms`,
            }}
          >
            <p className="typo-regular text-nowrap rounded-sm bg-white px-2.5 py-1 text-gray-700 shadow-xl">
              {button.text}
            </p>
            <button
              className="bg-main-900 flex size-10 shrink-0 items-center justify-center rounded-full text-white"
              onClick={() => onClick(button.value)}
            >
              <button.icon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
