import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface User {
  name: string;
  email: string;
  password: string;
  avatar: { url: string }[];
  role: string;
  createdAt: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

const UserSchema = new Schema<User>({
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

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export default model<User>('user', UserSchema);
