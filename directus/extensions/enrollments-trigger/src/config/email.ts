import nodemailer from 'nodemailer';
import { logToFile } from '../utils';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.EMAIL_ENV === 'development';

export const emailConfig ={
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

logToFile(`Email config: ${JSON.stringify(emailConfig)} \n  ${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`);

// Create reusable transporter object using SMTP transport
export const transporter = nodemailer.createTransport(emailConfig);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    // In development, always send to mock email
    const targetEmail = isDevelopment ? process.env.EMAIL_MOCK : to;
    
    if (!targetEmail) {
      throw new Error('No target email specified');
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: targetEmail,
      subject: isDevelopment ? `[DEV] ${subject}` : subject,
      html: isDevelopment 
        ? `<div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px;">
            <strong>Development Mode</strong><br>
            Original recipient: ${to}<br>
            Redirected to: ${targetEmail}
           </div>
           ${html}`
        : html
    }
    const info = await transporter.sendMail(mailOptions);
    
    logToFile(`Message sent: ${info.messageId} ${JSON.stringify(mailOptions, null, 2)}`);
    if (isDevelopment) {
      logToFile(`Development mode - Email redirected to: ${targetEmail}`);
      logToFile(`Original recipient would have been: ${to}`);
    }
    return info;
  } catch (error) {
    logToFile(`Error sending email: ${error}`);
    throw error;
  }
};
