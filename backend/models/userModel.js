const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    profilename: { type: String },
    profilepath: { type: String },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true, maxlength: 32 },
    password: { type: String, maxlength: 128, minlength: 6, required: true },
    gender: { type: String },
    phone: { type: Number, maxlength: 10, minlength: 10 },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate JWT Token
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.Jwt_Secret_Key, {
    expiresIn: "7d",
  });
};

module.exports = mongoose.model("users", userSchema);
