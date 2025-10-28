import { ReviewCreateDTO } from "@repo/types";

import { NextFunction, Request, Response } from "express";

import { successHandler } from "../middlewares/responseHandler";
import reviewService from "../services/reviewService";
import { BadRequestError } from "../utils/customError";

class ReveiwController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const dto = JSON.parse(req.body.data) as ReviewCreateDTO;
      if (!isAddRoadDTO(dto)) { throw new BadRequestError('요청 형식이 잘못되었습니다.'); }
      const files = req.files as Express.Multer.File[];

      const newReview = await reviewService.createReview(userId, dto, files);
      return successHandler(res, '리뷰 생성 완료', { newReivew: newReview, userId: userId });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const reviewId = parseInt(req.params.reviewId, 10);
      if (isNaN(reviewId)) {
        throw new BadRequestError("리뷰ID는 필수이며 숫자여야 합니다.");
      }

      await reviewService.deleteReview(userId, reviewId);
      return successHandler(res, "리뷰 삭제 완료", reviewId);
    } catch (error) {
      next(error);
    }
  }

  async showOneReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = parseInt(req.params.reviewId, 10);
      if (isNaN(reviewId)) {
        throw new BadRequestError("리뷰ID는 필수이며 숫자여야 합니다.");
      }

      const reveiw = await reviewService.showOneReview(reviewId);
      return successHandler(res, "개별 리뷰 조회 성공", reveiw);
    } catch (error) {
      next(error);
    }
  }

  async showAllReview(req: Request, res: Response, next: NextFunction) {
    try {
      const spotId = req.params.spotId;
      if (!spotId || typeof spotId !== 'string' || spotId.trim() === '') { throw new BadRequestError('장소ID는 필수이며 빈 문자열일 수 없습니다.'); }
      
      const { reviews, reviewAvg } = await reviewService.showAllReview(spotId)
      return successHandler(res, "모든 리뷰 조회 성공", { reviews, reviewAvg });
    } catch (error) {
      next(error);
    }
  }
}

function isAddRoadDTO(obj: any): obj is ReviewCreateDTO {
  return (
    typeof obj.spotId === "string" &&
    typeof obj.content === "string" &&
    typeof obj.rate === "number"
  );
}

export default new ReveiwController();
