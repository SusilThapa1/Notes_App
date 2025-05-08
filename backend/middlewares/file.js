const multer = require("multer");
const path = require("path");

// Dynamic storage setup based on request parameter
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function (req, file, cb) {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(
      null,
      `${fileNameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
