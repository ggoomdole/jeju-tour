import { NextFunction,Request, Response } from 'express';

import { successHandler } from '../middlewares/responseHandler';
import AuthService from '../services/authService';
import { BadRequestError } from '../utils/customError';

class AuthController {
  async kakaoLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      if (!code) { throw new BadRequestError('인가코드가 없습니다.'); }
      if (typeof code !== 'string') { throw new BadRequestError('인가코드는 문자열이어야 합니다.'); }

      const result = await AuthService.kakaoLoginService(code);
      return successHandler(res, '로그인 성공', result);
    } catch (error) {
      next(error);
    }
  }

  async kakaoUnlink(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) { throw new BadRequestError('액세스 토큰이 없습니다.'); }

      await AuthService.kakaoUnlinkService(accessToken);
      return successHandler(res, '회원 탈퇴 성공', null);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();