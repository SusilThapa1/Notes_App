const express = require("express");

const {
  uploadInsert,
  uploadUpdate,
  uploadList,
  uploadDelete,
  getSingleUpload,
} = require("../controllers/uploadController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const uploadRouter = express.Router();

uploadRouter.post("/addData", verifyToken, uploadInsert);
uploadRouter.get("/getUploadData", verifyToken, uploadList);
uploadRouter.get("/getMyUploads", verifyToken, getSingleUpload);
uploadRouter.put("/updateData/:id", verifyToken, uploadUpdate);
uploadRouter.delete("/deleteData/:id", verifyToken, uploadDelete);

module.exports = uploadRouter;
