const express = require("express");
const {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  sendEmailChangeVerifyOtp,
  verifyEmailChange,
  changePassword,
  sendPassResetOtp,
  verifyPassResetOtp,
  passResetSuccess,
  resetOtpResend,
  otpResend,
  heartbeat,
  removeSession,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../Utils/rateLimiter");

const authRouter = express.Router();

// Public routes - No authentication required
authRouter.post("/register", register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/send-emailverify-otp", sendVerifyOtp);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/pass-reset-otp", sendPassResetOtp);
authRouter.post("/pass-reset-otp-verify", verifyPassResetOtp);
authRouter.post("/pass-reset-success", passResetSuccess);
authRouter.post("/reset-otp-resend", resetOtpResend);
authRouter.post("/otp-resend", otpResend);

// Protected routes - Authentication required
authRouter.delete("/logout", verifyToken, logout);
authRouter.patch("/change-password", verifyToken, changePassword);
authRouter.post(
  "/send-email-change-verify-otp",
  verifyToken,
  sendEmailChangeVerifyOtp
);
authRouter.post("/verify-email-change", verifyToken, verifyEmailChange);
authRouter.put("/heartbeat", verifyToken, heartbeat);
authRouter.delete("/session/:deviceId", verifyToken, removeSession);

module.exports = authRouter;
