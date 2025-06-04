const {
  sendReview,
  getReviews,
  adminReply,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const express = require("express");
const reviewRouter = express.Router();

reviewRouter.post("/send-review", verifyToken, sendReview);
reviewRouter.get("/view-review", getReviews);
reviewRouter.put("/reply-review/:id", verifyAdmin, adminReply);
reviewRouter.patch("/update-review/:id", verifyToken, updateReview);
reviewRouter.delete("/delete-review/:id", verifyToken, deleteReview);

module.exports = reviewRouter;
