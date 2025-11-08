const express = require("express");

const {
  uploadInsert,
  uploadUpdate,
  uploadList,
  uploadDelete,
  getSingleUpload,
  likes,
  disLikes,
} = require("../controllers/uploadController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const uploadRouter = express.Router();

uploadRouter.post("/addData", verifyToken, uploadInsert);
uploadRouter.get("/getUploadData", verifyToken, uploadList);
uploadRouter.get("/getMyUploads", verifyToken, getSingleUpload);
uploadRouter.put("/updateData/:id", verifyToken, uploadUpdate);
uploadRouter.delete("/deleteData/:id", verifyToken, uploadDelete);
uploadRouter.put("/:id/like",verifyToken,likes)
uploadRouter.put("/:id/dislike",verifyToken,disLikes)

module.exports = uploadRouter;
