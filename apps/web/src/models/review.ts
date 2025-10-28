import type { ReviewCheckDTO } from "@repo/types";

export interface ReviewDTO {
  reviewAvg: number;
  reviews: ReviewCheckDTO[];
}
