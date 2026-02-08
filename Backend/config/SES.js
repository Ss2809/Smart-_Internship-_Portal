import nodemailer from "nodemailer";
import { SESv2Client } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const transporter = nodemailer.createTransport({
  SES: { sesClient },
});

const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `Smart Internship Portal <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
