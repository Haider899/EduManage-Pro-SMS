import nodemailer from 'nodemailer';
import { config } from './config.js';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: Number(config.smtp.port),
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const mailOptions = {
    from: 'EduManage SMS <noreply@edumanage.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[EMAIL] Failed to send email to ${options.email}:`, error);
    console.log('--- EMAIL MESSAGE START ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log('--- EMAIL MESSAGE END ---');
    
    if (config.nodeEnv === 'production') {
      throw error;
    }

    return null;
  }
};
