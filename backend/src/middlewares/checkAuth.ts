import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import userModel from '../model/user.model';
import { verifyToken } from '../utils/jwt';
import { newRequest } from '../interfaces';

export default async (req: newRequest, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    next(new createError.Unauthorized('Please login'));
  }

  const decoded = verifyToken(accessToken);

  // @ts-ignore
  const user = await userModel.findById(decoded.aud);

  if (!user) {
    next(new createError.Unauthorized('Please login again with valid email/password'));
  }

  req.user = user;

  next();
};
