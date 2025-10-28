import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayRoad {
  userId: string;
}

export default function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) { return next(); }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET!;

    const decoded = jwt.verify(token, secret) as JwtPayRoad;
    if (!decoded.userId) { return next(); }

    const userIdInt = parseInt(decoded.userId, 10);
    if (!isNaN(userIdInt)) { req.user = { userId: userIdInt };}

    next();
  } catch (error) {
    return next();
  }
}