const express = require("express");
const {
  semesterInsert,
  semesterDelete,
  semesterList,
  semesterUpdate,
  semesterSingle,
} = require("../controllers/semesterController");

const semesterRouter = express.Router();

semesterRouter.post("/add", semesterInsert);
semesterRouter.get("/semesterView", semesterList);
semesterRouter.delete("/delete/:id", semesterDelete);
semesterRouter.get("/singlesemester/:id", semesterSingle);
semesterRouter.put("/update/:id", semesterUpdate);

module.exports = semesterRouter;
