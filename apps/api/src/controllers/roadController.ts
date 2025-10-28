import { RoadRequestDTO } from "@repo/types";

import { NextFunction, Request, Response } from "express";

import { successHandler } from "../middlewares/responseHandler";
import roadService from "../services/roadService";
import { BadRequestError, NotFoundError } from "../utils/customError";

class RoadController {
  async loadAllRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

      const sortBy = (req.query.sortBy as string) || "popular";
      if (!sortBy) throw new NotFoundError("정렬 기준이 존재하지 않습니다.");

      const allPilgrimage = await roadService.loadAllRoad(categoryId, sortBy);
      return successHandler(res, "순례길 조회 성공", allPilgrimage);
    } catch (error) {
      next(error);
    }
  }

  async loadPapularRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

      const popularRoads = await roadService.getPopularRoads(categoryId);
      return successHandler(res, "인기 순례길 조회 성공", popularRoads);
    } catch (error) {
      next(error);
    }
  }

  async createRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const dto = JSON.parse(req.body.data) as RoadRequestDTO;
      const imageFile = req.file;

      if (!isAddRoadDTO(dto)) {
        throw new BadRequestError("요청 형식이 잘못되었습니다.");
      }

      const newPilgrimage = await roadService.createRoad(dto, userId, imageFile);
      return successHandler(res, "순례길 생성 완료", newPilgrimage);
    } catch (error) {
      next(error);
    }
  }

  async createMyRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const dto = JSON.parse(req.body.data) as RoadRequestDTO;
      const imageFile = req.file;

      if (!isAddRoadDTO(dto)) {
        throw new BadRequestError("요청 형식이 잘못되었습니다.");
      }

      const newPilgrimage = await roadService.createMyRoad(dto, userId, imageFile);
      return successHandler(res, "커스텀 순례길 생성 완료", newPilgrimage);
    } catch (error) {
      next(error);
    }
  }

  async updateRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = parseInt(req.params.roadId);
      const dto: Partial<RoadRequestDTO> = JSON.parse(req.body.data);
      const imageFile = req.file;

      if (isNaN(roadId)) throw new BadRequestError("유효하지 않은 roadId입니다.");
      if (
        !imageFile &&
        !dto.title &&
        !dto.intro &&
        !dto.categoryId &&
        (!dto.spots || dto.spots.length === 0)
      ) {
        throw new BadRequestError("변경사항이 없습니다.");
      }

      const updatedRoad = await roadService.updateRoad(roadId, userId, dto, imageFile);
      return successHandler(res, "순례길 수정 완료", updatedRoad);
    } catch (error) {
      next(error);
    }
  }

  async checkName(req: Request, res: Response, next: NextFunction) {
    try {
      const title = req.query.title as string;
      if (!title) throw new NotFoundError("제목은 필수입니다.");

      const result = await roadService.checkDuplicateName(title);
      return successHandler(res, "순례길 이름 사용 가능 여부", result);
    } catch (error) {
      next(error);
    }
  }

  async loadDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const roadId = Number(req.params.roadId);
      if (!roadId) throw new NotFoundError("순례길 ID는 필수입니다.");

      const sortBy = (req.query.sortBy as string) || "default";
      if (!sortBy) throw new NotFoundError("정렬 기준이 존재하지 않습니다.");

      const result = await roadService.getOneRoadWithSpots(userId, roadId, sortBy);
      return successHandler(res, "순례길 세부 내용 조회 성공", result);
    } catch (error) {
      next(error);
    }
  }

  async loadParticipation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const maker = req.query.maker === "true";

      const categoryId = req.query.categoryId
        ? parseInt(req.query.categoryId as string)
        : undefined;

      const participationList = await roadService.getParticipatedRoads(userId, maker, categoryId);
      return successHandler(res, "참여중인 순례길 조회 성공", participationList);
    } catch (error) {
      next(error);
    }
  }

  async loadCustom(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;

      const categoryId = req.query.categoryId
        ? parseInt(req.query.categoryId as string)
        : undefined;

      const participationList = await roadService.loadCustomRoad(userId, categoryId);
      return successHandler(res, "커스텀 순례길 조회 성공", participationList);
    } catch (error) {
      next(error);
    }
  }

  async partiForRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = Number(req.params.roadId);

      const participate = await roadService.participateByRoadId(userId, roadId);
      return successHandler(res, participate.message, {
        userId: participate.userId,
        pilgrimageId: participate.pilgrimageId,
      });
    } catch (error) {
      next(error);
    }
  }

  async partioutRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = Number(req.params.roadId);

      const outRoad = await roadService.outByRoadId(userId, roadId);
      return successHandler(res, "순례길 나가기 완료", outRoad);
    } catch (error) {
      next(error);
    }
  }

  async deleteRoad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const roadId = Number(req.params.roadId);

      const result = await roadService.deleteRoad(userId, roadId);
      return successHandler(res, "순례길 삭제 완료", result);
    } catch (error) {
      next(error);
    }
  }
}

function isAddRoadDTO(obj: any): obj is RoadRequestDTO {
  return (
    typeof obj.title === "string" &&
    typeof obj.intro === "string" &&
    typeof obj.categoryId === "number" &&
    Array.isArray(obj.spots)
  );
}

export default new RoadController();
