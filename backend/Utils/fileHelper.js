const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
    } else {
      console.log("Deleted file:", fullPath);
    }
  });
};

module.exports = { deleteFile };
