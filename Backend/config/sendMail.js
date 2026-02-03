const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (to, otp) => {
  return await resend.emails.send({
    from:  "onboarding@resend.dev",
    to: to,
    subject: "Your OTP",
    html: `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes.</p>`,
  });
};

module.exports = sendOTP;
