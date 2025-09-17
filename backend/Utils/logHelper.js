const Action = require("../models/actionModel");

const logAction = async ({ user = {}, action, details = {}, req }) => {
  try {
    await Action.create({
      user: {
        _id: user._id || null,
        name: user.name || "Guest",
        role: user.role || "guest",
      },
      action,
      details,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null,
    });
  } catch (err) {
    console.error("Action log failed:", err.message);
  }
};

module.exports = { logAction };
