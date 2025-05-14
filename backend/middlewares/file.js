const multer = require("multer");
const path = require("path");

// Dynamic storage setup based on request parameter
const uploadStorage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function (req, file, cb) {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(
      null,
      `${fileNameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const profileStorage = multer.diskStorage({
  destination: "./profiles/images",
  filename: function (req, file, cb) {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(
      null,
      `${fileNameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: uploadStorage });
const profile = multer({ storage: profileStorage });

module.exports = { upload, profile };
