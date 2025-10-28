import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AllReviewCheckDTO, ReviewCheckDTO, ReviewCreateDTO } from "@repo/types";

import { v4 } from "uuid";

import s3 from "../config/s3-config";
import reviewRepository from "../repositories/reviewRepository";
import { ExistsError, NotFoundError, UnauthorizedError } from "../utils/customError";

class ReviewService {
  private BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

  private async uploadReviewImage(userId: number, file: Express.Multer.File): Promise<string> {
    const key = `review-images/${userId}/${Date.now()}-${v4()}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return `https://${this.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async createReview(
    userId: number,
    data: ReviewCreateDTO,
    files?: Express.Multer.File[]
  ): Promise<ReviewCheckDTO> {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => this.uploadReviewImage(userId, file));
      imageUrls = await Promise.all(uploadPromises);
      data.imageUrls = imageUrls;
    }

    const newReview = await reviewRepository.reveiwUpload(userId, {
      ...data,
      imageUrls,
    });

    return {
      reviewId: newReview.id,
      userId: newReview.userId ?? 0,
      nickname: newReview.user?.nickName ?? "알 수 없는 이용자",
      profileImage: newReview.user?.profileImage ?? null,
      spotId: newReview.spotId,
      content: newReview.text,
      rate: newReview.rate,
      imageUrls: newReview.imageUrls.map((img) => img.url) ?? [],
    };
  }

  async deleteReview(userId: number, reviewId: number): Promise<void> {
    const isOwner = await reviewRepository.isMyReviewCheck(userId, reviewId);
    if (!isOwner) {
      throw new UnauthorizedError("본인의 리뷰가 아닙니다.");
    }

    const road = await reviewRepository.findReviewById(reviewId);
    if (!road) throw new NotFoundError("해당 리뷰가 존재하지 않습니다.");

    await reviewRepository.deleteReview(reviewId);
  }

  async showOneReview(reviewId: number): Promise<ReviewCheckDTO> {
    const reviewById = await reviewRepository.findReviewById(reviewId);
    if (!reviewById) {
      throw new NotFoundError("리뷰가 존재하지 않습니다.");
    }

    return {
      reviewId: reviewById.id,
      userId: reviewById.userId ?? 0,
      nickname: reviewById.user?.nickName ?? "알 수 없는 이용자",
      profileImage: reviewById.user?.profileImage ?? null,
      spotId: reviewById.spotId,
      content: reviewById.text,
      rate: reviewById.rate,
      imageUrls: reviewById.imageUrls.map((img) => img.url) ?? [],
    };
  }

  async showAllReview(
    spotId: string
  ): Promise<{ reviews: AllReviewCheckDTO[]; reviewAvg: number }> {
    const rawReviews = await reviewRepository.findAllReviewById(spotId);
    if (!rawReviews || rawReviews.length === 0) {
      throw new NotFoundError("해당 장소에 리뷰가 존재하지 않습니다.");
    }

    const reviews: AllReviewCheckDTO[] = rawReviews.map((p) => ({
      reviewId: p.id,
      spotId: p.spotId,
      content: p.text,
      rate: p.rate ?? 0,
      imageUrls: p.imageUrls?.map((img) => img.url) ?? [],
      userId: p.userId ?? 0,
      nickname: p.user?.nickName ?? "알 수 없는 이용자",
      profileImage: p.user?.profileImage ?? null,
    }));

    const reviewAvg = calculateAverageRate(rawReviews);

    return { reviews, reviewAvg };
  }
}

// 리뷰 평점 계산
function calculateAverageRate(reviews: { rate: number }[]): number {
  const rates = reviews.filter((r) => r.rate !== null && r.rate !== undefined).map((r) => r.rate);

  if (rates.length === 0) return 0;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

export default new ReviewService();
