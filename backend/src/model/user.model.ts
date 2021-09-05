import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateResetToken } from '../utils/generateKeys';
require('dotenv/config');

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: { url: string }[];
  role: string;
  createdAt: Date;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
  isValidPassword(password: string): boolean;
  getResetPasswordToken(): string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
  },
  email: {
    type: String,
    requied: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'password must be longer than 6 characters'],
    select: false,
    // select:false means 'Do not display password when showing the users'
  },
  avatar: {
    url: { type: String },
  },
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = generateResetToken(resetToken);

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

export default model<IUser & Document>('user', UserSchema);
