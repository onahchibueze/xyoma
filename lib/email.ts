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
 * Sends a welcome email to a newly registered user.
 * 
 * @param {string} to - Recipient email address.
 * @param {string} name - Recipient name.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const subject = "Welcome to XYOMA — The Future of Luxury";
  const baseUrl = process.env.NEXTAUTH_URL || 'https://xyoma.com';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to XYOMA</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr>
          <td style="padding: 60px 40px 40px 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 200; letter-spacing: 12px; text-transform: uppercase; color: #ffffff;">XYOMA</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 40px 40px 40px; text-align: center;">
            <p style="margin: 0; font-size: 14px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Welcome to the Inner Circle</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: left;">
            <p style="margin: 0; font-size: 18px; font-weight: 300; line-height: 1.6;">Hello ${name},</p>
            <p style="margin: 20px 0 0 0; font-size: 16px; font-weight: 300; line-height: 1.8; color: #d4d4d4;">
              You have successfully joined XYOMA. We are more than just a brand; we are a movement dedicated to the fusion of cinematic aesthetics and high-end fashion editorial inspiration.
            </p>
            <p style="margin: 20px 0 0 0; font-size: 16px; font-weight: 300; line-height: 1.8; color: #d4d4d4;">
              From minimal streetwear to premium gowns, every piece in our collection is crafted with meticulous attention to detail and a commitment to luxury.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 60px 40px; text-align: center;">
            <a href="${baseUrl}/collection" style="display: inline-block; padding: 18px 45px; background-color: #ffffff; color: #000000; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; transition: all 0.3s ease;">
              Explore Collection
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; text-align: center; border-top: 1px solid #1a1a1a;">
            <p style="margin: 0; font-size: 11px; font-weight: 300; letter-spacing: 1px; color: #525252; text-transform: uppercase;">
              XYOMA LUXURY FASHION &copy; ${new Date().getFullYear()}
            </p>
            <p style="margin: 15px 0 0 0; font-size: 10px; color: #404040; line-height: 1.5;">
              This email was sent to ${to}. You are receiving this because you signed up for an account on XYOMA.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({ to, subject, html });
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
