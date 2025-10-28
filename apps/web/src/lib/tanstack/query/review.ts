import { REVIEW } from "@/constants/review";
import { getReviewsById } from "@/services/review";
import { useQuery } from "@tanstack/react-query";

export const useGetReviewsById = (id: string) => {
  return useQuery({
    queryKey: [REVIEW.GET_REVIEWS_BY_ID, id],
    queryFn: async () => await getReviewsById(id),
  });
};
