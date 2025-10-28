import { SpotReqDTO } from '@repo/types';

import { NextFunction,Request, Response } from 'express';

import { successHandler } from '../middlewares/responseHandler';
import spotService from '../services/spotService';
import { BadRequestError } from '../utils/customError';

class SpotController {
  async getNearbySpots(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;
    
      if (!lat || !lng) throw new BadRequestError('위도와 경도는 필수입니다.');

      const spots = await spotService.fetchNearbySpots(String(lat), String(lng));
      return successHandler(res, '주변 관광지 조회 완료', spots);
    } catch (error) {
        next(error);
    }
  }

  async reqSpot(req: Request, res: Response, next: NextFunction) {
    try {
        const dto = req.body as SpotReqDTO;
        if (!isAddRoadDTO(dto)) { throw new BadRequestError('요청 형식이 잘못되었습니다.'); }
        const userId = req.user.userId;

        const reqAddSpot = await spotService.reqAddSpot(dto, userId);
        return successHandler(res, '장소 추가 요청 전송 완료', reqAddSpot);
    } catch (error) {
      next(error);
    }
  }

  async reqCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = Number(req.params.roadId);
      if (!roadId) throw new BadRequestError('순례길 ID는 필수입니다.');

      const result = await spotService.getRequestedSpots(userId, roadId);
      return successHandler(res, '장소 추가 요청 조회 완료', result);
    } catch (error) {
      next(error);
    }
  }

  async reqProcessing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = Number(req.params.roadId);
      const { approve = [], reject = [] } = req.body;

      await spotService.processSpotRequests(userId, roadId, approve, reject);
      return successHandler(res, '장소 추가 요청 처리 완료');
    } catch (error) {
      next(error);
    }
  }
}

function isAddRoadDTO(obj: any): obj is SpotReqDTO {
    return (
        typeof obj.roadId === 'number' &&
        Array.isArray(obj.spots) &&
        obj.spots.every(
            (spot: any) =>
                typeof spot.spotId === 'string' &&
                typeof spot.addNumber === 'number' &&
                typeof spot.addReason === 'string'
        )
    );
}

export default new SpotController();