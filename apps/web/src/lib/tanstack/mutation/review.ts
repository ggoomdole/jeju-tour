import { REVIEW } from "@/constants/review";
import { createReview, removeReview } from "@/services/review";
import { errorToast, successToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";

import { invalidateQueries } from "..";

export const useCreateReview = () => {
  return useMutation({
    mutationFn: createReview,
  });
};

export const useRemoveReview = (spotId: string) => {
  return useMutation({
    mutationFn: removeReview,
    onSuccess: () => {
      successToast("리뷰 삭제가 완료되었어요.");
      invalidateQueries([REVIEW.GET_REVIEWS_BY_ID, spotId]);
    },
    onError: () => {
      errorToast("리뷰 삭제에 실패했어요.");
    },
  });
};
