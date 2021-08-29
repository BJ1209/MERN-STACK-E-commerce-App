import jwt from 'jsonwebtoken';
import createError from 'http-errors';
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
      if (err) return reject(err);
      resolve(token);
    });
  });
};
