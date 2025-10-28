import Image from "next/image";

import Button from "@/components/common/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@/components/common/dialog";
import StarRating from "@/components/common/star/star-rating";
import { useRemoveReview } from "@/lib/tanstack/mutation/review";
import { ReviewCheckDTO } from "@repo/types";

import { Trash2 } from "lucide-react";

const DEFAULT_IMAGE_URL = "/static/default-thumbnail.png";

interface ReviewItemProps extends ReviewCheckDTO {
  currentUserId: string | null;
}

function RemoveReviewItemContent({ reviewId, spotId }: { reviewId: number; spotId: string }) {
  const { mutateAsync: removeReview, isPending } = useRemoveReview(spotId);
  const { close } = useDialog();

  const onRemoveReview = async () => {
    try {
      await removeReview(reviewId);
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DialogContent className="space-y-5 text-center">
      <h3 className="typo-semibold">삭제하기</h3>
      <p className="typo-medium">리뷰를 삭제하시겠습니까?</p>
      <div className="flex gap-2.5">
        <DialogClose
          disabled={isPending}
          className="typo-semibold from-main-700 to-main-900 flex-1 rounded-xl bg-gradient-to-r py-5 text-white disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300"
        >
          취소
        </DialogClose>
        <Button className="flex-1" variant="warning" onClick={onRemoveReview} disabled={isPending}>
          삭제
        </Button>
      </div>
    </DialogContent>
  );
}

export default function ReviewItem({
  userId,
  spotId,
  content,
  rate,
  profileImage,
  nickname,
  currentUserId,
  reviewId,
}: ReviewItemProps) {
  return (
    <div className="shadow-layout flex gap-2.5 rounded-xl p-3">
      <Image
        src={profileImage || DEFAULT_IMAGE_URL}
        alt="review image"
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <p className="typo-regular">{nickname}</p>
          <StarRating rating={rate} className="size-4" />
        </div>
        <p className="typo-regular">{content}</p>
      </div>
      {currentUserId === userId?.toString() && (
        <Dialog>
          <DialogTrigger
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
            aria-label="리뷰 삭제"
          >
            <Trash2 className="size-4" />
          </DialogTrigger>
          <RemoveReviewItemContent reviewId={reviewId} spotId={spotId} />
        </Dialog>
      )}
    </div>
  );
}
