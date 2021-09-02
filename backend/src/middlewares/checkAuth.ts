import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import userModel, { User } from '../model/user.model';
import { verifyToken } from '../utils/jwt';
import { Document } from 'mongoose';
interface newRequest extends Request {
  user?: (User & Document<any, any, any>) | null;
}

export default async (req: newRequest, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    next(new createError.Unauthorized('Please login'));
  }

  const decoded = verifyToken(accessToken);

  // @ts-ignore
  req.user = await userModel.findById(decoded.aud);

  next();
};
