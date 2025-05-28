let express = require("express");
const {
  userList,
  userDelete,
  userUpdate,
  userSignUp,
  userLogin,
  logout,
  userUploadProfile,
  userProfile,
  deleteProfileImage,
  userAccountDelete,
  changePassword,
  sendVerifyOtp,
  verifyEmail,
  sendEmailChangeVerifyOtp,
  verifyEmailChange,
  sendPassResetOtp,
  verifyPassResetOtp,
  passResetSuccess,
  resendOtp,
  resetOtpResend,
  otpResend,
} = require("../controllers/userController");
const { profile } = require("../middlewares/file");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const userRouter = express.Router();
userRouter.post("/register", userSignUp);
userRouter.post("/login", userLogin);
userRouter.get("/view", verifyToken, verifyAdmin, userList);
userRouter.get("/userprofile", verifyToken, userProfile);
userRouter.patch("/update/:id", verifyToken, userUpdate);
userRouter.patch(
  "/profile/:id",
  verifyToken,
  profile.single("image"),
  userUploadProfile
);
userRouter.patch("/change-password", verifyToken, changePassword);
userRouter.delete("/profileimageDelete/:id", verifyToken, deleteProfileImage);
userRouter.post("/delete", verifyToken, userAccountDelete);
userRouter.delete("/delete/:id", verifyToken, verifyAdmin, userDelete);
userRouter.delete("/logout", logout);
userRouter.post("/send-emailverify-otp", sendVerifyOtp);
userRouter.post("/verify-email", verifyEmail);
userRouter.post(
  "/send-email-change-verify-otp",
  verifyToken,
  sendEmailChangeVerifyOtp
);
userRouter.post("/verify-email-change", verifyToken, verifyEmailChange);
userRouter.post("/pass-reset-otp", sendPassResetOtp);
userRouter.post("/pass-reset-otp-verify", verifyPassResetOtp);
userRouter.post("/pass-reset-success", passResetSuccess);
userRouter.post("/reset-otp-resend", resetOtpResend);
userRouter.post("/otp-resend", otpResend);

module.exports = userRouter;
