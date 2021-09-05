import crypto from 'crypto';

export const generateResetToken = (resetToken: string) =>
  crypto.createHash('sha256').update(resetToken).digest('hex');

const accessTokenSecretKey = crypto.randomBytes(32).toString('hex');

console.log(accessTokenSecretKey);
