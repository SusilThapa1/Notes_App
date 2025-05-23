const currentYear = new Date().getFullYear();

const verifyEmailHtml = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Email Verification</title>
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
    <h2 class="title">Email Verification Code</h2>
    <p class="message">Use this code to verify your email. It expires in 10 minutes.</p>
    <div class="otp-box">${otp}</div>
    <p class="message">If you didn’t request this, ignore this email.</p>
    <div class="footer">© ${currentYear} EasyStudyZone. All rights reserved.</div>
  </div>
</body>
</html>
`;

const verifyEmailText = (otp) => `
Verify your email

Use this code to verify your email: ${otp}
`;

const pass_Reset_Temp = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f9fc;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }
      .logo {
        display: block;
        margin: 0 auto 20px;
        width: 120px;
        border-radius: 20px;
      }
      .title {
        text-align: center;
        color: #333;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .otp-box {
        background-color: #f1f1f1;
        color: #000;
        padding: 12px 20px;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        letter-spacing: 8px;
        border-radius: 6px;
        margin: 20px auto;
        width: fit-content;
      }
      .message {
        text-align: center;
        font-size: 16px;
        color: #555;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #aaa;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img class="logo" src="{{image}}" alt="Logo" />
      <h2 class="title">Password Reset Code</h2>
      <p class="message">
        Use the code below to reset your password. This code is valid for
        10 minutes.
      </p>
      <div class="otp-box">{{otp}}</div>
      <p class="message">
        If you didn't request this, you can safely ignore this email.
      </p>
      <div class="footer">© 2025 EasyStudyZone. All rights reserved.</div>
    </div>
  </body>
</html>`;

module.exports = { verifyEmailHtml, verifyEmailText, pass_Reset_Temp };
