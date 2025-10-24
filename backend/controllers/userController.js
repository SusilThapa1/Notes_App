const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const { deleteFile } = require("../Utils/fileHelper");
const { emailRegex } = require("../Utils/validators");
const { logAction } = require("../Utils/activityLog");
const logger = require("../Utils/logger");

// Upload Profile Image
const userUploadProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;
    console.log(userId);
    if (!file) {
      await logAction({
        user: req.user,
        action: "Profile Upload Attempt",
        details: { reason: "No file uploaded" },
        status: "failed",
        req,
      });
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    // Get user
    const user = await Users.findById(userId);
    if (!user) {
      await logAction({
        user: req.user,
        action: "Profile Upload Attempt",
        details: { reason: "User not found", userId },
        status: "failed",
        req,
      });
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete old profile image if exists
    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop();
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath);
    }

    // Update new profile
    user.profilename = file.filename;
    user.profilepath = `/profiles/images/${file.filename}`;
    await user.save();

    //  Log successful upload
    await logAction({
      user: req.user,
      action: "Upload new profile",
      details: { profilepath: user.profilepath, profilename: file.filename },
      status: "success",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        profilepath: user.profilepath,
        profilename: user.profilename,
      },
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }

    // System error → Winston logger
    logger.error("Profile upload failed", {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      file: req.file?.filename,
    });

    return res.status(500).json({ success: false, message: "Server error." });
  }
};

//deleteProfile
const deleteProfileImage = async (req, res) => {
  const userId = req.params.id;
  let oldImagename;

  try {
    logger.info(`Request to delete profile image for userId: ${userId}`);

    const user = await Users.findById(userId);
    if (!user) {
      logger.warn(`User not found for userId: ${userId}`);
      await logAction({
        user: req.user,
        action: "DELETE_PROFILE_IMAGE",
        details: { deletedImage: null, reason: "User not found" },
        status: "failed",
        req,
      });
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop();
      const relativePath = `profiles/images/${oldFilename}`;
      oldImagename = oldFilename;

      try {
        deleteFile(relativePath);
        logger.info(`Deleted file: ${relativePath}`);
      } catch (fileErr) {
        logger.error(
          `Failed to delete file ${relativePath}: ${fileErr.message}`
        );
      }
    } else {
      logger.info(`No profile image found for userId: ${userId}`);
    }

    user.profilename = null;
    user.profilepath = null;
    await user.save();
    logger.info(`Cleared profile info for userId: ${userId}`);

    await logAction({
      user: req.user,
      action: "DELETE_PROFILE_IMAGE",
      details: { deletedImage: oldImagename },
      status: "success",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image deleted",
      data: {
        profilename: null,
        profilepath: null,
      },
    });
  } catch (err) {
    logger.error(
      `Error deleting profile image for userId ${userId}: ${err.message}`
    );
    await logAction({
      user: req.user,
      action: "DELETE_PROFILE_IMAGE",
      details: { deletedImage: oldImagename, error: err.message },
      status: "failed",
      req,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// View users list
const userList = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.status(200).json({ success: true, message: "User List", data: users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

//fetch single user details
const userProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const deviceId = req.cookies.deviceId; // get current device from cookie

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        currentDeviceId: deviceId || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
        .json({ success: false, message: "All fields are required." });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    // Find user without password
    const existingUser = await Users.findById(userid).select("-password");
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check for duplicate email
    const duplicateEmailUser = await Users.findOne({
      email: email.toLowerCase(),
    });

    if (duplicateEmailUser && duplicateEmailUser._id.toString() !== userid) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    // Update fields
    existingUser.username = username;
    existingUser.email = email.toLowerCase();
    existingUser.gender = gender;

    await existingUser.save();

    await logAction({
      user: req.user,
      action: "User updated successfully.",
      details: { updatedUserId: userid, changes: { username, email, gender } },
      req,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: existingUser,
    });
  } catch (err) {
    console.error("User update error:", err.message);
    res.status(500).json({
      success: false,
      message: "Update failed.",
      error: err.message,
    });
  }
};

const userDelete = async (req, res) => {
  const userId = req.params.id;
  try {
    await Users.findByIdAndDelete(userId);

    await logAction({
      user: req.user,
      action: "User deleted by admin",
      details: { deletedUserId: userId },
      req,
    });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Deletion failed", error: err.message });
  }
};

const userAccountDelete = async (req, res) => {
  try {
    const userId = req.userid;
    const { password } = req.body;

    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Delete profile image if exists
    if (user.profilepath) {
      const oldFilename = user.profilepath.split("/").pop(); // get filename only
      const relativePath = `profiles/images/${oldFilename}`;
      deleteFile(relativePath); // delete from server
    }

    await Users.findByIdAndDelete(userId);
    await logAction({
      user: req.user,
      action: "User account deleted successfully",
      details: { deletedUserId: userId, email: req.user.email },
      req,
    });

    clearCookie(res, "token");
    clearCookie(res, "deviceId");
    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changeRole = async (req, res) => {
  const { id, role } = req.body;
  try {
    const user = await Users.findById(id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    user.role = role;

    await user.save();

    await logAction({
      user: req.user,
      action: "CHANGE_ROLE",
      details: { changedUserId: id, newRole: role },
      req,
    });

    return res
      .status(200)
      .json({ success: true, message: `Successfully changed role to ${role}` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  userUploadProfile,
  deleteProfileImage,
  userList,
  userProfile,
  userUpdate,
  userDelete,
  userAccountDelete,
  changeRole,
};
