const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const { deleteFile } = require("../Utils/fileHelper");
const {
  emailRegex,
  passwordRegex,
  phoneRegex,
} = require("../Utils/validators");

// Register
const userSignUp = async (req, res) => {
  try {
    const { username, email, password, gender, phone } = req.body;

    if (!username || !email || !password || !gender || !phone) {
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

    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ success: 0, message: "Phone number must be 10 digits." });
    }

    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: 0, message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      gender,
      phone,
    });

    await newUser.save();

    const token = newUser.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: 1,
      message: "Registered Successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
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
      const oldFilename = user.profilepath.split("/").pop(); // get filename only
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath); // delete from server
    }

    //  Update DB with new profile image info
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
      deleteFile(req.file.path); // delete newly uploaded if error
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

    if (!password) {
      return res
        .status(400)
        .json({ success: 0, message: "Password is required." });
    }

    const user = await Users.findOne({ email });
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
      secure: process.env.NODE_ENV === "production" ? true : false,
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
  });
  res.status(200).json({ success: 1, message: "Logged out successfully" });
};

// View users list
const userList = async (req, res) => {
  try {
    const users = await Users.find();
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
    const user = await Users.findById(req.userid);
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
  try {
    const { username, email, gender, phone } = req.body;
    const existingUser = await Users.findById(userid);
    if (!existingUser) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }
    const update = {
      username,
      email,
      gender,
      phone,
    };

    if (!username || !email || !gender || !phone) {
      return res
        .status(400)
        .json({ success: 0, message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid email format." });
    }
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ success: 0, message: "Phone number must be 10 digits." });
    }

    const updatedUser = await Users.updateOne({ _id: userid }, update);

    res.status(200).json({
      success: 1,
      message: "User details updated successfuly",
      data: updatedUser,
    });
  } catch (err) {
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
      res
        .status(500)
        .json({ success: 0, message: "Update failed", error: err.message });
    }
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

module.exports = {
  userSignUp,
  userUploadProfile,
  deleteProfileImage,
  userLogin,
  logout,
  userList,
  userProfile,
  userUpdate,
  userDelete,
};
