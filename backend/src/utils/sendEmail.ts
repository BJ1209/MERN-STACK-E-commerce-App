import nodemailer, { Transporter } from 'nodemailer';
require('dotenv/config');

export default async (email: string, subject: string, message: string) => {
  const transporter: Transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject,
    text: message,
  });
};
