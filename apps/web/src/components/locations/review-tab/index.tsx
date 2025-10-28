"use client";

import type { ReviewDTO } from "@/models/review";

import { Loader2 } from "lucide-react";

import RegisterReview from "./register-review";
import ReviewItem from "./review-item";
import StarRating from "../../common/star/star-rating";

interface ReviewTabProps {
  id: string;
  currentUserId: string | null;
  data: ReviewDTO | undefined;
  isLoading: boolean;
  isNotFoundError: boolean;
}

export default function ReviewTab({
  id,
  currentUserId,
  data,
  isLoading,
  isNotFoundError,
}: ReviewTabProps) {
  return (
    <section className="divide-main-100 divide-y-8">
      <div className="typo-medium flex flex-col items-center gap-2 py-2.5">
        <h3 className="text-gray-700">
          {currentUserId === null ? "로그인 후 후기를 남겨주세요!" : "방문 후기를 남겨주세요!"}
        </h3>
        <RegisterReview currentUserId={currentUserId} locationId={id} />
      </div>
      <div className="space-y-2.5 p-5">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2.5">
            <Loader2 className="size-5 animate-spin text-gray-500" />
            <p className="typo-regular text-gray-500">후기를 불러오는 중이에요.</p>
          </div>
        ) : isNotFoundError ? (
          <div className="flex flex-col items-center gap-2.5">
            <p className="typo-regular text-gray-500">아직 등록된 후기가 없어요.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <p className="typo-medium text-gray-700">{data?.reviewAvg.toFixed() || 0}</p>
                <StarRating rating={data?.reviewAvg || 0} className="size-5" />
              </div>
              <p className="typo-regular text-gray-500">후기 {data?.reviews.length}</p>
            </div>
            <div className="space-y-2.5">
              {data?.reviews.map((review, index) => (
                <ReviewItem
                  key={`review-item-${index}`}
                  {...review}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
