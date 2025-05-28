const express = require("express");

const {
  uploadInsert,
  uploadUpdate,
  uploadList,
  uploadDelete,
} = require("../controllers/uploadController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const uploadRouter = express.Router();

uploadRouter.post("/addData", verifyToken, verifyAdmin, uploadInsert);

uploadRouter.get("/getUploadData", uploadList);
uploadRouter.put("/updateData/:id", verifyToken, verifyAdmin, uploadUpdate);
uploadRouter.delete("/deleteData/:id", verifyToken, verifyAdmin, uploadDelete);

module.exports = uploadRouter;
