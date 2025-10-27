const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type; // e.g. notes, questions, etc.
    
 const uploadPath = `./uploads/${type}`
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(null, `${fileNameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const profileStorage = multer.diskStorage({
  destination: "./profiles/images",
  filename: (req, file, cb) => {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(null, `${fileNameWithoutExt}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: uploadStorage });
const profile = multer({ storage: profileStorage });

module.exports = { upload, profile };
