const mongoose = require("mongoose");

const programSchema = mongoose.Schema(
  {
    imagename: {
      type: String,
      required: true,
    },
    imagepath: {
      type: String,
      required: true,
    },
    programmefullname: {
      type: String,
      unique: true,
      required: true,
    },
    programmeshortname: {
      type: String,
      unique: true,
      required: true,
    },
    academicstructure: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("programme", programSchema);
