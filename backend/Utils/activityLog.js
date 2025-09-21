const Action = require("../models/actionModel");

const logAction = async ({ user = {}, action, details = {}, status, req }) => {
  try {
    await Action.create({
      user: {
        _id: user._id || null,
        name: user.username || "Guest",
        role: user.role || "guest",
        email: user.email || null,
      },
      action,
      details,
      status,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null,
    });
  } catch (err) {
    console.error("Action log failed:", err.message);
  }
};

module.exports = { logAction };
