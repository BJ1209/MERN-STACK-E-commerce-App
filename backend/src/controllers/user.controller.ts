import { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';
import createError from 'http-errors';
import { createCookie } from '../utils/jwt';

export const newUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new createError.BadRequest();
  }

  // Checking if the user exists
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new createError.Conflict(`${email} is already been registered!`);
  }

  const newUser = new User({ name, email, password });

  const user = await newUser.save();

  createCookie(user, 200, res);
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new createError.BadRequest('Invalid Email/Password');
  }

  // select({password : 1}) means to fetch password parameter also along all the user data
  const user = await User.findOne({ email }).select({ password: 1 });

  if (!user) {
    throw new createError.NotFound(`User not registered`);
  }

  const isPasswordCorrect = await user.isValidPassword(password);

  if (!isPasswordCorrect) throw new createError.Unauthorized('Invalid Email/Password');

  createCookie(user, 200, res);
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  res
    .status(200)
    .cookie('accessToken', null, { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: 'logged out successfully' });
};
