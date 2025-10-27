const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    universityID: { type: mongoose.Schema.Types.ObjectId, ref: "universities", required: true },
    resources: { type: String, enum: ["syllabus", "notes", "questions"], required: true },
    programmeID: { type: mongoose.Schema.Types.ObjectId, ref: "programmes", required: true },
      courseCode: { type: String },
    courseName: { type: String },
    year: { type: Number },
    semyear: {
      type: String,
      enum: [
        "1st Semester","2nd Semester","3rd Semester","4th Semester",
        "5th Semester","6th Semester","7th Semester","8th Semester",
        "1st Year","2nd Year","3rd Year","4th Year",
      ],
      required: true,
    },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

uploadSchema.pre("save", function (next) {
  if (this.resources === "questions" && !this.year) {
    return next(new Error("Year is required for questions resource"));
  }
  if ((this.resources === "syllabus" || this.resources === "notes") && (!this.courseCode || !this.courseName)) {
    return next(new Error("Course code and name are required for syllabus or notes"));
  }
  next();
});


module.exports = mongoose.model("Uploads", uploadSchema);
