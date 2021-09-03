import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from './model/user.model';

export interface responseError extends Error {
  status?: number;
}

export interface newRequest extends Request {
  user: (IUser & Document<any, any, any>) | null;
}
