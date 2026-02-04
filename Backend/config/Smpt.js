import nodemailer from "nodemailer";

const Transport = nodemailer.createTransport({
   host: "email-smtp.ap-south-1.amazonaws.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  }
});

// Letter emails
const sentsmtpemail = async (to, subject, text) => {
  const mailoption = {
    from: `"Internship Offer" <${process.env.smtp_user}>`,
    to,
    subject,
    text,
  };
  await Transport.sendMail(mailoption);
  console.log("Email sent!");
};

// OTP or general email
const sendEmail = async (to, subject, text) => {
  await Transport.sendMail({
    from: process.env.smtp_user,
    to,
    subject,
    text,
  });
};

// Forgot password email
const forgetemail = async (to, subject, text) => {
  await Transport.sendMail({
    from: process.env.smtp_user,
    to,
    subject,
    text,
  });
};

export { sentsmtpemail, sendEmail, forgetemail };
