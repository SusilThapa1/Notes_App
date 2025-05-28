const express = require("express");
const {
  semesterInsert,
  semesterDelete,
  semesterList,
  semesterUpdate,
  semesterSingle,
} = require("../controllers/semesterController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const semesterRouter = express.Router();

semesterRouter.post("/add", verifyToken, verifyAdmin, semesterInsert);
semesterRouter.get("/semesterView", semesterList);
semesterRouter.delete("/delete/:id", verifyToken, verifyAdmin, semesterDelete);
semesterRouter.get(
  "/singlesemester/:id",

  semesterSingle
);
semesterRouter.put("/update/:id", verifyToken, verifyAdmin, semesterUpdate);

module.exports = semesterRouter;
