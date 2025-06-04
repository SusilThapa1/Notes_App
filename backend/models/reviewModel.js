const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reply: {
      text: String,
      repliedDate: String,
      repliedBy: {
        name: String,
        email: String,
        userId: mongoose.Schema.Types.ObjectId, // optional backup ref
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("review", reviewSchema);
