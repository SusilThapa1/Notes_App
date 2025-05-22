const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: 0, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.Jwt_Secret_Key);
    req.userid = decoded.id;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: 0, message: "Invalid or expired token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: 0, message: "No token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.Jwt_Secret_Key);
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: 0, message: "Access denied, admin only" });
    }

    req.user = user; // attach user to req for later use
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: 0, message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken, verifyAdmin };
