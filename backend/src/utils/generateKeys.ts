import crypto from 'crypto';

const accessTokenSecretKey = crypto.randomBytes(32).toString('hex');

console.log(accessTokenSecretKey);
