const mongoose = require("mongoose");

const semesterSchema = mongoose.Schema(
  {
    semestername: {
      type: String,
      required: true,
    },
    programmename: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("semesters", semesterSchema);
