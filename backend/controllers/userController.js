const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const path = require("path");
const { deleteFile } = require("../Utils/fileHelper");
const {
  emailRegex,
  passwordRegex,
  phoneRegex,
} = require("../Utils/validators");
const transporter = require("../config/nodeMailer");
const {
  verifyEmailHtml,
  verifyEmailText,
  verifyEmailChangeHtml,
  pass_Reset_Temp,
} = require("../config/emailTemplates");
const { default: mongoose } = require("mongoose");

// Register
const userSignUp = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !email || !password || !gender) {
      return res
        .status(400)
        .json({ success: 0, message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid email format." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: 0,
        message:
          "Password must be atleast 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol.",
      });
    }

    const userExists = await Users.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res
        .status(400)
        .json({ success: 0, message: "User already exists." });
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

    const tempToken = jwt.sign(
      { id: newUser._id },
      process.env.Jwt_Secret_Key,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: 1,
      message: "Registered Successfully",
      tempToken,
      user: {
        id: newUser._id,
      },
    });
  } catch (err) {
    console.error("SignUp Error:", err.message);
    res
      .status(500)
      .json({ success: 0, message: "Registration failed", error: err.message });
  }
};

// Update user profile (with profile image upload)
const userUploadProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: 0, message: "No file uploaded." });
    }

    //  Get the user first to check old image
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found." });
    }

    //  If previous profile image exists, delete it
    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop();
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath);
    }

    //  Update DB with new profile image
    user.profilename = file.filename;
    user.profilepath = `${process.env.SERVER_BASE_URL}/profiles/images/${file.filename}`;
    await user.save();

    return res.status(200).json({
      success: 1,
      message: "Profile image updated successfully",
      data: {
        profilepath: user.profilepath,
        profilename: user.profilename,
      },
    });
  } catch (error) {
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }
    console.error("Profile upload failed:", error.message);
    return res.status(500).json({ success: 0, message: "Server error." });
  }
};

//deleteProfile
const deleteProfileImage = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop();
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath);
    }

    user.profilename = null;
    user.profilepath = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image deleted",
      data: {
        profilename: null,
        profilepath: null,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid email format." });
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: 0, message: "Email and password are required." });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: 0, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid credentials" });
    }

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: 1,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res
      .status(500)
      .json({ success: 0, message: "Login failed", error: err.message });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 0,
  });
  res.status(200).json({ success: 1, message: "Logged out successfully" });
};

// View users list
const userList = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.status(200).json({ success: 1, message: "User List", data: users });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

//fetch single user details
const userProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.userid).select("-password");
    res.status(200).json({ success: 1, message: "User fetched", data: user });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

// update userdetails
const userUpdate = async (req, res) => {
  const userid = req.params.id;
  const { username, email, gender } = req.body;

  try {
    // Validation
    if (!username || !email || !gender) {
      return res
        .status(400)
        .json({ success: 0, message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid email format." });
    }

    // Find user without password
    const existingUser = await Users.findById(userid).select("-password");
    if (!existingUser) {
      return res.status(404).json({ success: 0, message: "User not found." });
    }

    // Check for duplicate email
    const duplicateEmailUser = await Users.findOne({
      email: email.toLowerCase(),
    });

    if (duplicateEmailUser && duplicateEmailUser._id.toString() !== userid) {
      return res
        .status(400)
        .json({ success: 0, message: "Email already in use." });
    }

    // Update fields
    existingUser.username = username;
    existingUser.email = email.toLowerCase();
    existingUser.gender = gender;

    await existingUser.save();

    res.status(200).json({
      success: 1,
      message: "User updated successfully.",
      data: existingUser,
    });
  } catch (err) {
    console.error("User update error:", err.message);
    res.status(500).json({
      success: 0,
      message: "Update failed.",
      error: err.message,
    });
  }
};

const userDelete = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: 1, message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: 0, message: "Deletion failed", error: err.message });
  }
};

const userAccountDelete = async (req, res) => {
  try {
    const userId = req.userid;
    const { password } = req.body;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: 0, message: "Incorrect password" });
    }

    // Delete profile image if exists
    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop(); // get filename only
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath); // delete from server
    }

    await Users.findByIdAndDelete(userId);

    res.clearCookie("token");
    res
      .status(200)
      .json({ success: 1, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: 0, message: "Email is required" });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: 0, message: "Account already verified." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Email Verification OTP`,
      text: verifyEmailText(otp),
      html: verifyEmailHtml(otp).replace("{{image}}", "cid:logo@easy"),
      attachments: [
        {
          filename: "desktop.png",
          path: path.join(__dirname, "desktop.png"),
          cid: "logo@easy",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: 1,
      message: `Verification OTP sent on email: ${email.toLowerCase()}`,
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { otp, userId } = req.body;
  // console.log(userId, otp);
  if (!otp) {
    return res.json({
      success: 0,
      message: "Enter the OTP sent to your email",
    });
  }
  try {
    const user = await Users.findById(
      new mongoose.Types.ObjectId(userId)
    ).select("-password");
    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    if (user.otp === "" || user.otp !== otp) {
      return res.json({ success: 0, message: "Invalid OTP" });
    }
    if (user.otpExpireAt < Date.now()) {
      return res.json({ success: 0, message: "OTP is expired" });
    }

    user.isAccountVerified = true;
    user.otp = "";
    user.otpExpireAt = 0;

    await user.save();

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: 1,
      message: "Email verified successfully.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

//Send Email change verify otp to user
const sendEmailChangeVerifyOtp = async (req, res) => {
  try {
    const userId = req.userid;
    const { email: newEmail } = req.body;

    if (!newEmail) {
      return res.json({ success: 0, message: "New email is required" });
    }

    if (!emailRegex.test(newEmail)) {
      return res.json({ success: 0, message: "Invalid email format" });
    }

    // Optional: check if new email is already in use
    const existing = await Users.findOne({ email: newEmail.toLowerCase() });
    if (existing) {
      return res.json({ success: 0, message: "Email already in use" });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000; // shorter expiry, like 10 min
    user.newEmail = newEmail.toLowerCase(); // store temp

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newEmail.toLowerCase(),
      subject: `Email Change Verification OTP`,
      text: verifyEmailText(otp),
      html: verifyEmailChangeHtml(otp).replace("{{image}}", "cid:logo@easy"),
      attachments: [
        {
          filename: "desktop.png",
          path: path.join(__dirname, "desktop.png"),
          cid: "logo@easy",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: 1,
      message: `OTP sent to new email: ${newEmail.toLowerCase()}`,
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

const verifyEmailChange = async (req, res) => {
  const userId = req.userid;
  const { otp } = req.body;

  if (!otp) {
    return res.json({
      success: 0,
      message: "Enter the OTP sent to your new email",
    });
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.json({ success: 0, message: "Invalid OTP" });
    }

    if (user.otpExpireAt < Date.now()) {
      return res.json({ success: 0, message: "OTP expired" });
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
      success: 1,
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
    res.json({ success: 0, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userid;
    const { oldpassword, newpassword } = req.body;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: 0,
        message: "User not found",
      });
    }

    if (oldpassword === newpassword) {
      return res.status(400).json({
        success: 0,
        message: "New password must be different from old one",
      });
    }

    const passMatch = await bcrypt.compare(oldpassword, user.password);
    if (!passMatch) {
      return res.status(400).json({
        success: 0,
        message: "Old password is incorrect",
      });
    }

    if (!passwordRegex.test(newpassword)) {
      return res.status(400).json({
        success: 0,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: 1,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to change password",
      error: err.message,
    });
  }
};

const sendPassResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: 0, message: "Enter your registered email" });
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email.toLowerCase(),
      subject: `Email Verification OTP`,
      text: verifyEmailText(otp),
      html: pass_Reset_Temp(otp).replace("{{image}}", "cid:logo@easy"),
      attachments: [
        {
          filename: "desktop.png",
          path: path.join(__dirname, "desktop.png"),
          cid: "logo@easy",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: 1, message: "Otp has been sent to your email" });
  } catch (err) {
    res.json({ success: 0, message: err.message });
  }
};

const verifyPassResetOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp) {
    return res.json({ success: 0, message: "Enter 6 digits OTP first" });
  }
  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );
    if (!user) {
      res.json({ success: 0, message: "User not found" });
    }

    if (otp !== user.resetOtp) {
      return res.json({ success: 0, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: 0, message: "OTP expired" });
    }

    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.isAccountVerified = true;

    await user.save();

    res.json({ success: 1, message: "OTP verified" });
  } catch (err) {
    res.json({ success: 0, message: err.message });
  }
};

const passResetSuccess = async (req, res) => {
  const { password, email } = req.body;

  if (!password) {
    return res.json({ success: 0, message: "Password is required" });
  }

  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );
    if (!user) {
      return res.json({ success: 0, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ success: 1, message: "Password has been reset successfully" });
  } catch (err) {
    res.json({ success: 0, message: err.message });
  }
};

const resetOtpResend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: 0, message: "Email is required" });
  }

  try {
    const user = await Users.findOne({ email: email.toLowerCase() }).select(
      "-password"
    );

    if (!user) {
      return res.status(400).json({ success: 0, message: "User not found" });
    }

    const now = new Date();
    const cooldown = 50 * 1000; // 50 seconds

    if (user.otpRequestedAt && now - user.otpRequestedAt < cooldown) {
      const secondsLeft = Math.ceil(
        (cooldown - (now - user.otpRequestedAt)) / 1000
      );
      return res.status(429).json({
        success: 0,
        message: `Please wait ${secondsLeft}s before requesting another OTP.`,
        secondsLeft,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    user.otpRequestedAt = now;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email.toLowerCase(),
      subject: `Resend Email Verification OTP`,
      text: verifyEmailText(otp),
      html: pass_Reset_Temp(otp).replace("{{image}}", "cid:logo@easy"),
      attachments: [
        {
          filename: "desktop.png",
          path: path.join(__dirname, "desktop.png"),
          cid: "logo@easy",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: 1, message: "OTP has been resent successfully" });
  } catch (err) {
    return res.status(500).json({ success: 0, message: err.message });
  }
};
const otpResend = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(400).json({ success: 0, message: "User not found" });
    }

    const now = new Date();
    const cooldown = 50 * 1000; // 50 seconds

    if (user.otpRequestedAt && now - user.otpRequestedAt < cooldown) {
      const secondsLeft = Math.ceil(
        (cooldown - (now - user.otpRequestedAt)) / 1000
      );
      return res.status(429).json({
        success: 0,
        message: `Please wait ${secondsLeft}s before requesting another OTP.`,
        secondsLeft,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.otp = otp;
    user.otpExpireAt = Date.now() + 10 * 60 * 1000;
    user.otpRequestedAt = now;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Resend Email Verification OTP`,
      text: verifyEmailText(otp),
      html: pass_Reset_Temp(otp).replace("{{image}}", "cid:logo@easy"),
      attachments: [
        {
          filename: "desktop.png",
          path: path.join(__dirname, "desktop.png"),
          cid: "logo@easy",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: 1, message: "OTP has been resent successfully" });
  } catch (err) {
    return res.status(500).json({ success: 0, message: err.message });
  }
};

const changeRole = async (req, res) => {
  const { id, role } = req.body;
  try {
    const user = await Users.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ success: 0, message: "User not found" });
    }

    user.role = role;

    await user.save();

    return res
      .status(200)
      .json({ success: 1, message: `Successfully changed role to ${role}` });
  } catch (err) {
    res.status(400).json({ success: 0, message: err.message });
  }
};

module.exports = {
  userSignUp,
  userUploadProfile,
  deleteProfileImage,
  userLogin,
  logout,
  userList,
  userProfile,
  changePassword,
  userUpdate,
  userDelete,
  userAccountDelete,
  sendVerifyOtp,
  verifyEmail,
  verifyEmailChange,
  sendEmailChangeVerifyOtp,
  sendPassResetOtp,
  verifyPassResetOtp,
  passResetSuccess,
  resetOtpResend,
  otpResend,
  changeRole,
};
