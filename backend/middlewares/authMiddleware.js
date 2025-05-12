const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookie

  if (!token) {
    return res
      .status(401)
      .json({ success: 0, message: "Access denied. No token." });
  }

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

module.exports = verifyToken;
