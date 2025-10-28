import { Response } from 'express';

export function successHandler(res: Response, message = '성공', data: any = null) {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}