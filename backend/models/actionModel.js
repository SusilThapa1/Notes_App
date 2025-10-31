const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },  
      role: { type: String, required: true },  
      email: { type: String, required: true },
    },
    action: {
      type: String,
      required: true,  
    },
    details: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    ipAddress: {
      type: String,  
    },
    userAgent: {
      type: String,  
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
