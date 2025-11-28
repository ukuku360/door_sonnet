import nodemailer from 'nodemailer';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_TO = process.env.EMAIL_TO;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Create email HTML template
 */
function createEmailTemplate(data: {
  unitNumber: number;
  firstName: string;
  timestamp: string;
}): string {
  const dataUrl = `${APP_URL}/api/data`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
        .info-row { margin: 10px 0; padding: 10px; background-color: white; border-radius: 3px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; }
        .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">새로운 도어 접근 문제 신고</h2>
        </div>
        <div class="content">
          <p>기숙사 거주자로부터 새로운 도어 접근 문제 신고가 접수되었습니다.</p>

          <div class="info-row">
            <span class="label">유닛 넘버:</span>
            <span class="value">${data.unitNumber}</span>
          </div>

          <div class="info-row">
            <span class="label">이름:</span>
            <span class="value">${data.firstName}</span>
          </div>

          <div class="info-row">
            <span class="label">제출 시간:</span>
            <span class="value">${data.timestamp}</span>
          </div>

          <a href="${dataUrl}" class="button">전체 데이터 확인하기</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send email notification to admin
 * @param data - Submission data
 * @returns Promise that resolves when email is sent
 */
export async function sendAdminNotification(data: {
  unitNumber: number;
  firstName: string;
}): Promise<void> {
  if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_TO) {
    throw new Error('Email configuration not complete');
  }

  // Generate timestamp in KST
  const timestamp = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `"기숙사 도어 시스템" <${EMAIL_USER}>`,
    to: EMAIL_TO,
    subject: '새로운 도어 접근 문제 신고',
    html: createEmailTemplate({ ...data, timestamp }),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw new Error('Failed to send email notification');
  }
}
