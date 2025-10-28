import { NextFunction,Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { BadRequestError,UnauthorizedError } from '../utils/customError';

interface JwtPayRoad {
  userId: string;
}

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) { throw new UnauthorizedError('인증 토큰이 없습니다.'); }
    if (!authHeader.startsWith('Bearer ')) { throw new BadRequestError('인증 토큰이 형식에 맞지 않습니다.'); }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET!;

    const decoded = jwt.verify(token, secret) as JwtPayRoad;
    if (!decoded.userId) { throw new UnauthorizedError('유효하지 않은 토큰입니다.'); }

    const userIdInt = parseInt(decoded.userId, 10);
    if (isNaN(userIdInt)) throw new UnauthorizedError('토큰에 저장된 userId가 유효하지 않습니다.');

    req.user = { userId: userIdInt };
    next();
  } catch (error) {
    next(error);
  }
}