import { BaseResponseDTO } from "@/models";
import type { ReviewDTO } from "@/models/review";

import { clientApi } from "./api";

export const getReviewsById = async (id: string): Promise<BaseResponseDTO<ReviewDTO>> => {
  return clientApi.get(`review/spot/${id}`);
};

export const createReview = async (formData: FormData): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.post("review", undefined, { body: formData });
};

export const removeReview = async (reviewId: number): Promise<BaseResponseDTO<unknown>> => {
  return clientApi.delete(`review/${reviewId}`);
};
