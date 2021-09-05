import jwt, { JwtPayload } from 'jsonwebtoken';
import createError from 'http-errors';
import { Document } from 'mongoose';
import { Response } from 'express';
import { IUser } from '../model/user.model';
require('dotenv/config');

export const createToken = (id: string) => {
  return new Promise((resolve, reject) => {
    const payload = {},
      secret = `${process.env.JWT_ACCESS_TOKEN_SECRET_KEY}`,
      options = {
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME}`,
        issuer: 'shoping-app',
        audience: id,
      };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createError.InternalServerError());
      resolve(token);
    });
  });
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, `${process.env.JWT_ACCESS_TOKEN_SECRET_KEY}`);
};

export const createCookie = async (
  user: IUser & Document<any, any, any>,
  statusCode: number,
  res: Response
) => {
  const accessToken = await createToken(user.id);

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE_TIME) * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      accessToken,
    });
};
