import { NextFunction, Response } from 'express';
import User from '../model/user.model';
import createError from 'http-errors';
import { createCookie } from '../utils/jwt';
import sendEmail from '../utils/sendEmail';
import { generateResetToken } from '../utils/generateKeys';
import { newRequest } from '../interfaces';

export const newUser = async (req: newRequest, res: Response, next: NextFunction) => {
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

export const loginHandler = async (req: newRequest, res: Response, next: NextFunction) => {
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

export const logoutHandler = async (req: newRequest, res: Response, next: NextFunction) => {
  res
    .status(200)
    .cookie('accessToken', null, { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: 'logged out successfully' });
};

export const forgotPasswordHandler = async (req: newRequest, res: Response, next: NextFunction) => {
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

export const verifyResetTokenHandler = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
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

export const getUserProfile = async (req: newRequest, res: Response, next: NextFunction) => {
  const id = req.user?.id;

  const user = await User.findById(id);

  res.status(200).json({ success: true, message: 'User Details', user });
};

export const updatePasswordHandler = async (req: newRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.id;

  const user = await User.findById(userId).select({ password: 1 });

  const isMatched = await user?.isValidPassword(oldPassword);

  if (!isMatched) {
    throw new createError.BadRequest('Invalid Password');
  }

  if (!newPassword || !confirmPassword) {
    throw new createError.BadRequest('Invalid Passwords');
  }

  if (newPassword !== confirmPassword) {
    throw new createError.BadRequest('Passwords does not match');
  }

  user!.password = newPassword;
  await user!.save();

  createCookie(user!, 200, res);
};

// ADMIN ROUTES------------------------------------------------
export const getAllUsers = async (req: newRequest, res: Response, next: NextFunction) => {
  const users = await User.find().select({ __v: 0 });

  if (users.length < 1) {
    return res.status(200).json({ success: false, message: 'No Users found' });
  }

  const responseObject = {
    success: true,
    message: 'All users',
    count: users.length,
    users: users.map(({ id, name, avatar, createdAt, email, role }) => {
      return {
        id,
        name,
        email,
        role,
        createdAt,
        avatar,
        request: {
          type: 'GET',
          message: 'Get single user detail',
          url: `http://localhost:4000/api/v1/users/admin/${id}`,
        },
      };
    }),
  };

  res.status(200).json(responseObject);
};

export const getUserById = async (req: newRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new createError.NotFound('User not found');
  }

  res.status(200).json({ success: true, message: 'User details', user });
};

export const updateUserById = async (req: newRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new createError.NotFound('User not found');
  }

  await User.updateOne({ _id: userId }, req.body);

  res.status(200).json({
    success: true,
    message: 'User Updated',
    request: { type: 'GET', Url: `http://localhost:4000/api/v1/users/admin/${userId}` },
  });
};
export const deleteUserById = async (req: newRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new createError.NotFound('User not found');
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: 'user deleted',
  });
};
