import { NextFunction,Request, Response } from 'express';

import { CustomError } from '../utils/customError';

export function errorHandler(
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = (err instanceof CustomError && err.statusCode) || 500;
    const message = err.message || '서버 에러';

    console.error(`[Error] ${req.method} ${req.url} - ${message}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: true,
        message
    });
}