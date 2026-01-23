const nodemailer = require("nodemailer");

const Transport = nodemailer.createTransport({
  host: process.env.smtp_host,
  port: Number(process.env.smtp_port),
  secure: true,
  auth: {
    user: process.env.smtp_user,
    pass: process.env.smtp_pass,
  },
});
//letter
const sentsmtpemail = async (to, subject, text) => {
  const mailoption = {
    from: `"Intership Offer" <${process.env.smtp_user}>`,
    to: to,
    subject: subject,
    text: text,
  };
  await Transport.sendMail(mailoption);
  console.log("email sent !!");
};
//otp
const sendEmail = async (to, subject, text) => {
  await Transport.sendMail({
    from: process.env.smtp_user,
    to,
    subject,
    text,
  });
};

const forgetemail = async(to, subject,text)=>{
  await Transport.sendMail({
    from : process.env.smtp_user,
    to,
    subject,
    text
  })
}

module.exports = {sentsmtpemail,sendEmail,forgetemail};
