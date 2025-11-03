const path = require("path");

const currentYear = new Date().getFullYear();

const emailTemplatesConfig = {
  verifyEmail: {
    title: "Email Verification Code",
    message: "Use this code to verify your email. It expires in 10 minutes.",
    text: (otp) => `Verify your email\n\nYour verification code is: ${otp}\nIt expires in 10 minutes.`,
  },
  passwordReset: {
    title: "Password Reset Code",
    message: "Use the code below to reset your password. This code is valid for 10 minutes.",
    text: (otp) => `Reset your password\n\nYour reset code is: ${otp}\nIt expires in 10 minutes.`,
  },
  emailChange: {
    title: "Confirm Your New Email",
    message: "To complete your email change, enter this code. It expires in 10 minutes.",
    text: (otp) => `Confirm your new email\n\nYour verification code is: ${otp}\nIt expires in 10 minutes.`,
  },
};

const generateEmailTemplates = (type, otp) => {
  const config = emailTemplatesConfig[type];
  if (!config) throw new Error("Invalid email type");

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${config.title}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f6f9fc; margin: 0; padding: 0; }
      .email-container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
      .logo { display: block; margin: 0 auto 20px; width: 120px; border-radius: 20px; }
      .title { text-align: center; color: #333; font-size: 24px; margin-bottom: 10px; }
      .otp-box { background: #f1f1f1; padding: 12px 20px; font-size: 28px; font-weight: bold; letter-spacing: 8px; border-radius: 6px; text-align: center; margin: 20px auto; width: fit-content; color: #000; }
      .message { text-align: center; font-size: 16px; color: #555; margin: 20px 0; }
      .footer { text-align: center; font-size: 13px; color: #aaa; margin-top: 40px; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img class="logo" src="{{image}}" alt="EasyStudyZone Logo" />
      <h2 class="title">${config.title}</h2>
      <p class="message">${config.message}</p>
      <div class="otp-box">${otp}</div>
      <p class="message">If you didn't request this, you can safely ignore this email.</p>
      <div class="footer">© ${currentYear} EasyStudyZone. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;

  return { html, text: config.text(otp) };
};

module.exports = { generateEmailTemplates };
