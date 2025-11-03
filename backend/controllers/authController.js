// controllers/authController.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const { emailRegex, passwordRegex } = require("../Utils/validators");
const { logAction } = require("../Utils/activityLog");
const logger = require("../Utils/logger");
const {
  getPublicIP,
  parseDeviceInfo,
  getGeoLocation,
  getOrCreateDeviceId,
  updateUserSession,
} = require("../Utils/authHelper");
const { setCookie, clearCookie } = require("../Utils/cookieHelper");
const sendEmail = require("../Utils/sendMail"); // centralized sender

// Register
const register = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !email || !password || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be atleast 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol.",
      });
    }

    const userExists = await Users.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      gender,
    });

    await newUser.save();

    await logAction({
      user: req.user,
      action: "New user register",
      details: { email: newUser.email },
      status: "success",
      req,
    });

    res.status(200).json({
      success: true,
      message: "Registered Successfully",
      user: {
        id: newUser._id,
      },
    });
  } catch (err) {
    logger.error("SignUp Error", {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });

    if (!user.isAccountVerified)
      return res.status(200).json({
        success: true,
        message: "Account not verified. OTP required.",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isAccountVerified: false,
        },
      });

    const token = user.generateJWT();

    //  Use helpers
    const ip = await getPublicIP(req);
    const userAgent = req.get("user-agent") || "unknown";
    const { deviceName, browserName } = parseDeviceInfo(userAgent);
    const location = await getGeoLocation(ip);
    const deviceId = await getOrCreateDeviceId(req, user._id);

    //  Update or create session
    updateUserSession(user, deviceId, {
      ip,
      userAgent,
      device: deviceName,
      browser: browserName,
      location,
    });

    await user.save();

    //  Set cookies
    setCookie(res, "token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    setCookie(res, "deviceId", deviceId, { maxAge: 365 * 24 * 60 * 60 * 1000 });

    //  Clean response
    const { password: pwd, otp, resetOtp, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { ...safeUser, currentDeviceId: deviceId },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const deviceId = req.cookies.deviceId;
    const user = await Users.findById(req.user?.id);

    if (user && deviceId) {
      // Deactivate current session
      const session = user.sessions.find((s) => s.deviceId === deviceId);
      if (session) {
        session.isActive = false;
        session.lastActiveAt = new Date();
      }
      await user.save();

      // Clear only token
      clearCookie(res, "token");
      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    }

    // If user doesn't exist, clear all cookies and still respond
    if (!user) {
      clearCookie(res, "token");
      clearCookie(res, "deviceId");
      return res
        .status(200)
        .json({ success: true, message: "Logged out (user not found)" });
    }
  } catch (err) {
    // Respond with failure, don't touch cookies
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // centralized send
    await sendEmail({ to: user.email, type: "verifyEmail", otp });

    // IMPORTANT: send userId back so frontend can pass it to verify endpoint
    return res.json({
      success: true,
      message: `Verification OTP sent to ${email.toLowerCase()}`,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("sendVerifyOtp error:", error);
    return res.json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { otp, userId, email } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Enter the OTP sent to your email",
      });
    }

    // Find user
    let user = null;

    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user id" });
      }
      user = await Users.findById(userId).select("-password");
    } else if (email) {
      user = await Users.findOne({ email: email.toLowerCase() }).select(
        "-password"
      );
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User identifier missing" });
    }

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    //  Validate OTP
    if (!user.otp || user.otp !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpireAt || user.otpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    //  Mark verified and clear OTP
    user.isAccountVerified = true;
    user.otp = "";
    user.otpExpireAt = 0;

    //   Device/session info
    const ip = await getPublicIP(req);
    const userAgent = req.get("user-agent") || "unknown";
    const { deviceName, browserName } = parseDeviceInfo(userAgent);
    const location = await getGeoLocation(ip);
    const deviceId = await getOrCreateDeviceId(req, user._id);

    //  Update or create session (if stored inside user doc)
    updateUserSession(user, deviceId, {
      ip,
      userAgent,
      device: deviceName,
      browser: browserName,
      location,
    });

    //  Save all changes in a single DB write
    await user.save();

    //  Generate JWT after verification
    const token = user.generateJWT();

    //  Set cookies
    setCookie(res, "token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    setCookie(res, "deviceId", deviceId, { maxAge: 365 * 24 * 60 * 60 * 1000 });

    //  Clean response
    const { password, otp: OTP, resetOtp, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: { ...safeUser, currentDeviceId: deviceId },
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// Send Email change verify otp to user
const sendEmailChangeVerifyOtp = async (req, res) => {
  try {
    const userId = req.userid;
    const { email: newEmail } = req.body;

    if (!newEmail) {
      return res.json({ success: false, message: "New email is required" });
    }

    if (!emailRegex.test(newEmail)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Optional: check if new email is already in use
    const existing = await Users.findOne({ email: newEmail.toLowerCase() });
    if (existing) {
      return res.json({ success: false, message: "Email already in use" });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.newEmail = newEmail.toLowerCase(); // store temp

    await user.save();

    // use centralized sender -> sends to new email
    await sendEmail({ to: newEmail.toLowerCase(), type: "emailChange", otp });

    res.json({
      success: true,
      message: `OTP sent to new email: ${newEmail.toLowerCase()}`,
    });
  } catch (error) {
    console.error("sendEmailChangeVerifyOtp error:", error);
    res.json({ success: false, message: error.message });
  }
};

const verifyEmailChange = async (req, res) => {
  const userId = req.userid;
  const { otp } = req.body;

  if (!otp) {
    return res.json({
      success: false,
      message: "Enter the OTP sent to your new email",
    });
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Replace email with newEmail
    user.email = user.newEmail;
    user.newEmail = "";
    user.otp = "";
    user.otpExpireAt = 0;
    user.isAccountVerified = true;

    await user.save();

    const updatedUser = await Users.findById(userId).select("-password");
    const newToken = updatedUser.generateJWT();

    res.json({
      success: true,
      message: "Email changed and verified successfully.",
      token: newToken,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAccountVerified: updatedUser.isAccountVerified,
        gender: updatedUser.gender,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userid;
    const { oldpassword, newpassword } = req.body;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (oldpassword === newpassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old one",
      });
    }

    const passMatch = await bcrypt.compare(oldpassword, user.password);
    if (!passMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (!passwordRegex.test(newpassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();

    await logAction({
      user: req.user,
      action: "CHANGE_PASSWORD",
      details: {},
      req,
    });

    clearCookie(res, "token");

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: err.message,
    });
  }
};

const sendPassResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Enter your registered email" });
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    // centralized sender
    await sendEmail({ to: user.email, type: "passwordReset", otp });

    res.json({ success: true, message: "Otp has been sent to your email" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const verifyPassResetOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp) {
    return res.json({ success: false, message: "Enter 6 digits OTP first" });
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (otp !== user.resetOtp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.isAccountVerified = true;

    await user.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const passResetSuccess = async (req, res) => {
  const { password, email } = req.body;

  if (!password) {
    return res.json({ success: false, message: "Password is required" });
  }

  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const resetOtpResend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const cooldown = 50 * 1000; // 50 seconds

    if (user.otpRequestedAt && now - user.otpRequestedAt < cooldown) {
      const secondsLeft = Math.ceil(
        (cooldown - (now - user.otpRequestedAt)) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting another OTP.`,
        secondsLeft,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    user.otpRequestedAt = now;
    await user.save();

    // centralized sender -> resend password reset
    await sendEmail({ to: email.toLowerCase(), type: "passwordReset", otp });

    return res
      .status(200)
      .json({ success: true, message: "OTP has been resent successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const otpResend = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const cooldown = 50 * 1000; // 50 seconds

    if (user.otpRequestedAt && now - user.otpRequestedAt < cooldown) {
      const secondsLeft = Math.ceil(
        (cooldown - (now - user.otpRequestedAt)) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting another OTP.`,
        secondsLeft,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000;
    user.otpRequestedAt = now;
    await user.save();

    // centralized sender -> resend verification OTP
    await sendEmail({ to: user.email, type: "verifyEmail", otp });

    return res
      .status(200)
      .json({ success: true, message: "OTP has been resent successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const heartbeat = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);

    const deviceId = req.cookies.deviceId;
    const session = user.sessions.find((s) => s.deviceId === deviceId);

    if (!session) {
      // Remove the cookie
      clearCookie(res, "token");
      clearCookie(res, "deviceId");

      return res.status(401).json({
        success: false,
        message: "Session not found. You have been logged out.",
      });
    }

    session.lastActiveAt = new Date();
    await user.save();

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        currentDeviceId: deviceId,
      },
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

const removeSession = async (req, res) => {
  try {
    const { deviceId } = req.params;  
    const userId = req.userid;

    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const sessionIndex = user.sessions.findIndex(
      (s) => s.deviceId === deviceId
    );

    if (sessionIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    // prevent removing your own current session
    if (user.sessions[sessionIndex].deviceId === req.cookies.deviceId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your current session",
      });
    }

    user.sessions.splice(sessionIndex, 1); // remove session
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Session removed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error removing session",
      error: err.message,
    });
  }
};

module.exports = {
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
};
