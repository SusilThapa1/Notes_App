const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phoneRegex = /^[0-9]{10}$/; // Matches a 10-digit phone number
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/; // At least 8 characters, 1 letter uppercase, 1 letter lowercase, 1 number, 1 special character

let userSignUp = async (req, res) => {
  try {
    const { username, email, password, gender, phone } = req.body;

    // Validation for missing fields
    if (!username || !email || !password || !gender || !phone) {
      return res.status(400).json({
        success: 0,
        message: "Please provide all required fields",
      });
    }

    // Email validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: 0,
        message: "Invalid email format.",
      });
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: 0,
        message:
          "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",
      });
    }

    // Phone number validation
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: 0,
        message: "Phone number must be 10 digits long.",
      });
    }

    // Check if the user already exists
    let user = await Users.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: 0, message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      gender,
      phone,
    });

    await newUser.save();

    // Generate JWT token
    const token = newUser.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json({ success: 1, message: "Registered Successfully", token: token });
  } catch (err) {
    console.error("Error in userSignUp:", err);
    res
      .status(500)
      .json({ success: 0, message: "Registration failed", error: err.message });
  }
};

let userLogin = async (req, res) => {
  const { email, password } = req.body;

  // Email validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: 0,
      message: "Invalid email format.",
    });
  }

  // Password validation
  if (!password) {
    return res.status(400).json({
      success: 0,
      message: "Password is required.",
    });
  }

  let user = await Users.findOne({ email });
  if (user) {
    // Compare password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = user.generateJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res
        .status(200)
        .json({ success: 1, message: "User login success", token: token });
    } else {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid credentials" });
    }
  } else {
    return res.status(400).json({ success: 0, message: "User not found" });
  }
};

let userList = async (req, res) => {
  try {
    let allUsers = await Users.find();
    res.status(200).json({ success: 1, message: "User List", data: allUsers });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

let userDelete = async (req, res) => {
  try {
    let userid = req.params.id;
    let user = await Users.deleteOne({ _id: userid });
    res.status(201).json({ success: 1, message: "Deleted Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: 0, message: "Failed to delete", error: err.message });
  }
};

let userSingle = async (req, res) => {
  try {
    let userid = req.params.id;
    let user = await Users.findOne({ _id: userid });
    res
      .status(200)
      .json({ success: 1, message: "User fetched successfully.", data: user });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

let userUpdate = async (req, res) => {
  try {
    let userid = req.params.id;
    let { username, email, gender, phone } = req.body;
    let update = { username, email, gender, phone };
    let user = await Users.updateOne({ _id: userid }, update);
    res
      .status(200)
      .json({ success: 1, message: "Data updated successfully", data: user });
  } catch (err) {
    res.status(500).json({
      ssuccess: 0,
      message: "Failed yo update data",
      error: err.message,
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.status(200).json({ success: 1, message: "Successfully logged out" });
};

module.exports = {
  userSignUp,
  userLogin,
  userList,
  userSingle,
  userUpdate,
  userDelete,
  logout,
};
