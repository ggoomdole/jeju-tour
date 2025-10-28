import { NextFunction,Request, Response } from 'express';

import { successHandler } from '../middlewares/responseHandler';
import userService from '../services/userService';
import { BadRequestError } from '../utils/customError';

class UserController {
  async checkNickname(req: Request, res: Response, next: NextFunction) {
    try {
        const { nickname } = req.query;
        if (!nickname) { throw new BadRequestError('닉네임은 필수입니다.'); }
        if (typeof nickname !== "string") { throw new BadRequestError('닉네임은 문자열이어야 합니다.'); }
        
        const isAvailable = await userService.checkNicknameAvailability(nickname);
        return successHandler(res, '닉네임 사용 가능 여부', isAvailable);
    } catch (error) {
      next(error);
    }
  }

  async createNickname(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { nickname } = req.body;
      if (!nickname) { throw new BadRequestError('닉네임은 필수입니다.'); }
      if (typeof nickname !== "string") { throw new BadRequestError('닉네임은 문자열이어야 합니다.'); }
      
      const newNickname = await userService.createNickname(userId, nickname);
      return successHandler(res, '닉네임 생성 완료', newNickname);
    } catch (error: any) {
      next(error);
    }
  }

  async changeNickname(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { nickname } = req.body;
      if (!nickname) { throw new BadRequestError('닉네임은 필수입니다.'); }
      if (typeof nickname !== "string") { throw new BadRequestError('닉네임은 문자열이어야 합니다.'); }
      
      const updateNickname = await userService.changeNickname(userId, nickname);
      return successHandler(res, '닉네임 변경 완료', updateNickname);
    } catch (error: any) {
      next(error);
    }
  }

  async uploadProfileImage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      if (!req.file) { throw new BadRequestError('이미지 파일은 필수입니다.'); }
      
      const imageUrl = await userService.uploadProfileImage(userId, req.file);
      return successHandler(res, '프로필 이미지 등록 완료', imageUrl);
    } catch (error) {
      next(error);
    }
  }

  async changeTerm(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { term } = req.body;
      if (!term) { throw new BadRequestError('거주기간은 필수입니다.'); }
      
      const updateTerm = await userService.uploadTerm(userId, term);
      return successHandler(res, '거주기간 변경 완료', updateTerm);
    } catch (error: any) {
      next(error);
    }
  }

  async createUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { nickname } = req.body;
      if (!nickname) { throw new BadRequestError('닉네임은 필수입니다.'); }
      if (typeof nickname !== "string") { throw new BadRequestError('닉네임은 문자열이어야 합니다.'); }

      const { term } = req.body;

      const newNickname = await userService.createNickname(userId, nickname);
      const imageUrl = await userService.uploadProfileImage(userId, req.file);
      const termByUser = await userService.uploadTerm(userId, term);
      return successHandler(res, '유저 정보 생성 완료', { nickname: newNickname, imageUrl: imageUrl, term: termByUser});
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      
      const userInfo = await userService.userIdByInfo(userId);
      return successHandler(res, '유저 정보 조회 완료', userInfo);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();