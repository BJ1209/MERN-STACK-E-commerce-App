import { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';
import createError from 'http-errors';
import { createToken } from '../utils/jwt';

export const newUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new createError.BadRequest();
  }

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new createError.Conflict(`${email} is already been registered!`);
  }

  const newUser = new User({ name, email, password });

  const user = await newUser.save();

  const accessToken = await createToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    accessToken,
  });
};
