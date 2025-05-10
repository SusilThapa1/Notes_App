const express = require("express");

const {
  uploadInsert,
  uploadUpdate,
  uploadList,
  uploadDelete,
} = require("../controllers/uploadController");
const uploadRouter = express.Router();

uploadRouter.post("/addData", uploadInsert);

uploadRouter.get("/getUploadData", uploadList);
uploadRouter.put("/updateData/:id", uploadUpdate);
uploadRouter.delete("/deleteData/:id", uploadDelete);

module.exports = uploadRouter;
