import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: config.smtp.user ? {
    user: config.smtp.user,
    pass: config.smtp.pass
  } : undefined
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Collab Platform" <no-reply@collab.local>',
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};
