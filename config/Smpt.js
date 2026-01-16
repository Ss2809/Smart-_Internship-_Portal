const nodemailer = require("nodemailer")

const Transport = nodemailer.createTransport({
  host : process.env.smtp_host,
  port :process.env.smtp_port,
  secure:true,
  auth :[{
    user : process.env.smtp_user,
    pass : process.env.smtp_pass}
  ]
})

const sentsmtpemail = async(to, subject, text)=>{
const mailoption = {
  from:process.env.smtp_user,
  to,
  subject,
  text
}
  await Transport.sendMail(mailoption);
  console.log("email sent !!")
}

module.exports = sentsmtpemail;