const path = require("path");
const { generateEmailTemplates } = require("../config/emailTemplates");
const transporter  = require("../config/nodeMailer");

const sendEmail = async ({ to, type, otp }) => {
  const { html, text } = generateEmailTemplates(type, otp);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject: {
      verifyEmail: "Email Verification OTP",
      passwordReset: "Password Reset OTP",
      emailChange: "Email Change Verification OTP",
    }[type],
    text,
    html: html.replace("{{image}}", "cid:logo@easy"),
    attachments: [
      {
        filename: "desktop.png",
        path: path.join(__dirname, "../config/desktop.png"),
        cid: "logo@easy",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
