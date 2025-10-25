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
  programmeUpdate
);

programmeRouter.delete(
  "/deleteProgramme/:id",
  verifyToken,
  verifyAdmin,
  programmeDelete
);

module.exports = programmeRouter;
