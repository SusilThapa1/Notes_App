const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true }, // store snapshot of username at action time
      role: { type: String, required: true }, // e.g., "admin", "editor", "user"
    },
    action: {
      type: String,
      required: true, // e.g., "created_post", "deleted_user", "updated_profile"
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // flexible (object, string, etc.)
      default: {},
    },
    status: { type: String, enum: ["Success", "Failed"], default: "SUCCESS" },
    ipAddress: {
      type: String, // optional: track from req.ip
    },
    userAgent: {
      type: String, // optional: track from headers
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);
ActivityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 }
);

module.exports = mongoose.model("ActionLog", ActivityLogSchema);
