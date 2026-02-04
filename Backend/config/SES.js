import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

let sesClient = null;
let transporter = null;

const getTransporter = async () => {
  if (!transporter) {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS SES credentials not configured. Please check AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env file");
    }
    
    sesClient = new SESv2Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    transporter = nodemailer.createTransport({
      SES: {
        sesClient,
        SendEmailCommand,
      },
    });
  }
  return transporter;
};

export const sendEmail = async (to, subject, htmlOrText) => {
  try {
    const emailTransporter = await getTransporter();
    const isHTML = htmlOrText && (htmlOrText.includes("<") || htmlOrText.includes("</"));
    
    const fromEmail = process.env.EMAIL || "sushilpawar2321@gmail.com";
    const fromName = "Smart Internship Portal";
    const fromAddress = `${fromName} <${fromEmail}>`;
    
    let htmlContent = htmlOrText;
    let textContent = htmlOrText;
    
    if (!isHTML) {
      const escapeHtml = (text) => {
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
      };
      
      const escapedSubject = escapeHtml(subject);
      const escapedContent = escapeHtml(htmlOrText).replace(/\n/g, '<br>');
      
      htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedSubject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
    <h2 style="color: #2c3e50; margin-top: 0;">${escapedSubject}</h2>
    <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
      <p style="font-size: 16px; margin: 0;">${escapedContent}</p>
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
</body>
</html>`;
    }
    
    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'Reply-To': fromEmail,
        'List-Unsubscribe': `<mailto:${fromEmail}?subject=unsubscribe>`,
        'X-Mailer': 'Smart Internship Portal',
        'MIME-Version': '1.0',
      },
      messageId: `<${Date.now()}-${Math.random().toString(36).substring(7)}@smartinternshipportal.com>`,
      date: new Date(),
    };
    
    return await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    if (error.name === 'MessageRejected' && error.message.includes('not verified')) {
      const verifiedError = new Error("Email address not verified in AWS SES. Please verify the email address in AWS SES console or request production access.");
      verifiedError.name = error.name;
      verifiedError.code = error.code;
      verifiedError.statusCode = error.$metadata?.httpStatusCode;
      throw verifiedError;
    }
    throw error;
  }
};

export default sendEmail;
