const express = require("express");
const {
  programmeInsert,
  programmeList,
  programmeSingle,
  programmeUpdate,
  programmeDelete,
} = require("../controllers/programmeController");
const { upload } = require("../middlewares/file");

const programmeRouter = express.Router();

programmeRouter.post("/addProgramme", upload.single("image"), programmeInsert);
programmeRouter.get("/viewProgramme", programmeList);
programmeRouter.get("/singleProgramme/:id", programmeSingle);
programmeRouter.put(
  "/updateProgramme/:id",
  upload.single("image"),
  programmeUpdate
);

programmeRouter.delete("/deleteProgramme/:id", programmeDelete);

module.exports = programmeRouter;
