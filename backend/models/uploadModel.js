const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    resources: {
      type: String,
      enum: ["syllabus", "notes", "questions"],
      required: true,
    },
    programmename: {
      type: String,
      required: true,
    },
    academicstructure: {
      type: String,
    },
    semestername: {
      type: String,
    },

    year: {
      type: String,
    },

    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
