"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import BronzeMedal from "@/assets/bronze-medal.svg";
import GoldMedal from "@/assets/gold-medal.svg";
import SilverMedal from "@/assets/silver-medal.svg";
import { NativeType } from "@/constants/user";
import { useWithdrawRoad } from "@/lib/tanstack/mutation/road";
import { RoadResponseDTO } from "@/models/road";
import { CategoryType } from "@/types/category";

import Button from "../button";
import CategoryChip from "../chip/category-chip";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../dialog";

interface CourseCardProps extends RoadResponseDTO {
  href: string;
  isParticipate?: boolean;
  isMyCourse?: boolean;
}

const getLevelIcon = (level: NativeType) => {
  switch (level) {
    case "RESIDENT":
      return <GoldMedal />;
    case "LONG_TERM":
      return <SilverMedal />;
    case "MID_TERM":
      return <BronzeMedal />;
    default:
      return null;
  }
};

const DEFAULT_IMAGE_URL = "/static/default-thumbnail.png";

export default function CourseCard({
  roadId,
  categoryId,
  title,
  intro,
  imageUrl,
  participants,
  native,
  href,
  isParticipate,
  isMyCourse,
}: CourseCardProps) {
  const router = useRouter();

  const { mutateAsync: withdrawRoad, isPending } = useWithdrawRoad();

  const onWithdrawRoad = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await withdrawRoad(roadId.toString());
  };

  return (
    <div
      onClick={() => router.push(href)}
      className="flex w-full items-center justify-between gap-2.5 border-b border-b-gray-100 py-2.5 text-start"
    >
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="flex items-center gap-1">
          {getLevelIcon(native)}
          <CategoryChip category={categoryId as CategoryType} />
        </div>
        <p className="typo-semibold truncate">{title}</p>
        {!isMyCourse && (
          <p className="typo-regular text-gray-500">현재 {participants}명이 참여했어요!</p>
        )}
        <p className="typo-medium truncate">{intro}</p>
      </div>
      <div className="space-y-0.5">
        <div className="relative size-16">
          <Image
            src={imageUrl || DEFAULT_IMAGE_URL}
            alt={title}
            fill
            className="aspect-square rounded-sm object-cover"
          />
        </div>
        {isParticipate && (
          <Dialog>
            <DialogTrigger className="typo-regular bg-main-300 w-full rounded-sm">
              나가기
            </DialogTrigger>
            <DialogContent className="space-y-5 text-center">
              <h3 className="typo-semibold">순례길 나가기</h3>
              <p className="typo-medium">순례길을 나가시겠습니까?</p>
              <div className="flex gap-2.5">
                <DialogClose
                  disabled={isPending}
                  className="typo-semibold from-main-700 to-main-900 flex-1 rounded-xl bg-gradient-to-r py-5 text-white disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300"
                >
                  취소
                </DialogClose>
                <Button
                  className="flex-1"
                  variant="warning"
                  onClick={onWithdrawRoad}
                  disabled={isPending}
                >
                  나가기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
