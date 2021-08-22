import { NextFunction, Request, Response } from 'express';

export const getAllProducts = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'all products are shown here.' });
};
