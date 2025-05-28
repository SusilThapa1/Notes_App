const express = require("express");
const {
  programmeInsert,
  programmeList,
  programmeSingle,
  programmeUpdate,
  programmeDelete,
} = require("../controllers/programmeController");
const { upload } = require("../middlewares/file");
const { verifyAdmin, verifyToken } = require("../middlewares/authMiddleware");

const programmeRouter = express.Router();

programmeRouter.post(
  "/addProgramme",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  programmeInsert
);
programmeRouter.get("/viewProgramme", programmeList);
programmeRouter.get(
  "/singleProgramme/:id",

  programmeSingle
);
programmeRouter.put(
  "/updateProgramme/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  programmeUpdate
);

programmeRouter.delete(
  "/deleteProgramme/:id",
  verifyToken,
  verifyAdmin,
  programmeDelete
);

module.exports = programmeRouter;
