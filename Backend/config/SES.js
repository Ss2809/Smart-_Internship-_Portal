import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-sesv2";

const ses = new aws.SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const transporter = nodemailer.createTransport({
  SES: {
    ses,
    aws
  }
});

export const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: "Smart Internship <no-reply@smartinternshipportal.com>",
    to,
    subject,
    html
  });
};




export default sendEmail;
