import nodemailer from 'nodemailer';

function createTransporter() {

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be configured');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export async function sendOtpEmail(recipientEmail: string, otp: string, username: string) {

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"AI Timetable System" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Your OTP for AI Timetable Scheduling System',

    html: `
      <div style="font-family: Arial, sans-serif; max-width:560px; margin:auto">
        <h2>Verify your account</h2>
        <p>Hello ${username},</p>

        <p>Your OTP code is:</p>

        <div style="font-size:30px;letter-spacing:4px;font-weight:bold;margin:18px 0;">
          ${otp}
        </div>

        <p>This code is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}