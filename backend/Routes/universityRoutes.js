const express = require("express");
const {
  universityInsert,
  universityList,
  universitySingle,
  universityUpdate,
  universityDelete,
} = require("../controllers/universityController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const universityRouter = express.Router();

universityRouter.post("/add", verifyToken, verifyAdmin, universityInsert);
universityRouter.get("/list", universityList);
universityRouter.get("/single/:id", universitySingle);
universityRouter.put("/update/:id", verifyToken, verifyAdmin, universityUpdate);
universityRouter.delete(
  "/delete/:id",
  verifyToken,
  verifyAdmin,
  universityDelete
);

module.exports = universityRouter;
