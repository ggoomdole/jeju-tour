"use client";

import { useRouter } from "next/navigation";

import Plus from "@/assets/plus.svg";

export default function FloatingNavButton() {
  const router = useRouter();

  const onRouteToCourseUpload = () => {
    // 회원 검증하기
    router.push("/courses/upload");
  };

  return (
    <div className="fixed bottom-[calc(var(--spacing-navigation)+1.25rem)] mr-5 self-end">
      <button
        className="bg-main-100 text-main-900 shadow-floating-action-button relative z-10 rounded-full p-4"
        onClick={onRouteToCourseUpload}
      >
        <Plus />
      </button>
    </div>
  );
}
