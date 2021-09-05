import { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';
import createError from 'http-errors';
import { createCookie } from '../utils/jwt';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';
import { generateResetToken } from '../utils/generateKeys';

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

export const forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  // Check is user exist with this email
  const user = await User.findOne({ email });
  if (!user) {
    throw new createError.NotFound('User not registered');
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();

  // Save the user with the new resetToken and expire time
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset/${resetToken}`;

  const message = `Your Password Reset Link is as Follows:\n\n ${resetUrl} \n\n If You have not requested this email, then ignore it.`;

  try {
    await sendEmail(user.email, 'Password Recovery', message);
    res.status(200).json({ success: true, message: `Email sent to: ${user.email}` });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    throw new createError.InternalServerError();
  }
};

export const verifyResetTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  // hash the  token from params
  const resetPasswordToken = generateResetToken(resetToken.trim());

  // check if the hashedToken is valid and under the time limit
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) {
    throw new createError.BadRequest('Link is not valid or is expired');
  }

  if (password !== confirmPassword) {
    throw new createError.BadRequest('Passwords does not match');
  }

  // Setup the new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  createCookie(user, 200, res);
};
