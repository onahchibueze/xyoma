import nodemailer from 'nodemailer';

/**
 * Reusable SMTP transporter configuration.
 * Uses environment variables for sensitive credentials.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Interface for email sending options.
 */
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured SMTP transporter.
 * 
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} html - HTML content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 * @throws {Error} - Throws an error if the email fails to send.
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const from = process.env.EMAIL_FROM || '"XYOMA" <no-reply@xyoma.com>';

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
}
