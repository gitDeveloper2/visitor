// app/api/sendEmail/route.js
import nodemailer from 'nodemailer';
import { sendEmail } from '../../../lib/config/mailer';

export async function POST(req) {
  const { email, message } = await req.json();


  try {
await sendEmail(email,"Basic Utils Client Inquiry",message)
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ status: 'error', message: 'Error sending email' }), { status: 500 });
  }
}
