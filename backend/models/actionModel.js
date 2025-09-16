import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true }, // store snapshot of username at action time
      role: { type: String, required: true }, // e.g., "admin", "editor", "user"
    },
    action: {
      type: String,
      required: true, // e.g., "created_post", "deleted_user", "updated_profile"
    },
    
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

module.exports = mongoose.model("Action", actionSchema);

 
