import { NextFunction, Response } from 'express';
import { newRequest } from '../interfaces';
import createError from 'http-errors';

export default (role: string) => (req: newRequest, res: Response, next: NextFunction) => {
  if (role !== req.user!.role) {
    next(new createError.Forbidden(`${req.user!.role} is not allowed to access these resources`));
  }
  next();
};
