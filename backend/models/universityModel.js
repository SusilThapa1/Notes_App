const mongoose = require("mongoose");

const universitySchema = mongoose.Schema(
  {
    imagename: {
      type: String,
      required: true,
    },
    imagepath: {
      type: String,
      required: true,
    },
    universityfullname: {
      type: String,
      unique: true,
      required: true,
    },
    universityshortname: {
      type: String,
      unique: true,
      required: true,
    },
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("universities", universitySchema);
