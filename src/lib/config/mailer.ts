import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER as string; // e.g. support@basicutils.com
const EMAIL_PASS = process.env.EMAIL_PASS as string; // Zoho App Password

export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for SSL (port 465)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});


export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
) {
  const mailOptions = {
    from: "support@basicutils.com",
    to: 'support@basicutils.com',
    subject,
    html: htmlContent,
    replyTo: to,

  };

  await transporter.sendMail(mailOptions);
}


