"use client";

import { useState } from "react";

import { deleteCookie } from "@/utils/cookie";
import { revalidatePath } from "@/utils/revalidate";

import Button from "../common/button";
import { DialogClose, DialogContent } from "../common/dialog";

export default function Logout() {
  const [isPending, setIsPending] = useState(false);

  const onLogout = async () => {
    setIsPending(true);
    await deleteCookie("jwtToken");
    await deleteCookie("accessToken");
    await deleteCookie("userId");
    revalidatePath("/mypage");
  };

  return (
    <DialogContent className="space-y-5 text-center">
      <h3 className="typo-semibold">로그아웃</h3>
      <p className="typo-medium">로그아웃 하시겠습니까?</p>
      <div className="flex gap-2.5">
        <DialogClose
          disabled={isPending}
          className="typo-semibold from-main-700 to-main-900 flex-1 rounded-xl bg-gradient-to-r py-5 text-white disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300"
        >
          취소
        </DialogClose>
        <Button className="flex-1" variant="warning" onClick={onLogout} disabled={isPending}>
          로그아웃
        </Button>
      </div>
    </DialogContent>
  );
}
