const {
  sendReview,
  getReviews,
  adminReply,
  deleteReview,
  updateReview,
  deleteAdminReply,
  editAdminReply,
} = require("../controllers/reviewController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const express = require("express");
const reviewRouter = express.Router();

reviewRouter.post("/send-review", verifyToken, sendReview);
reviewRouter.get("/view-review", getReviews);
reviewRouter.put("/reply-review/:id", verifyAdmin, adminReply);
reviewRouter.put("/update-review/:id", verifyToken, updateReview);
reviewRouter.put(
  "/update-reviewreply/:id",
  verifyToken,
  verifyAdmin,
  editAdminReply
);
reviewRouter.put(
  "/delete-reviewreply/:id",
  verifyToken,
  verifyAdmin,
  deleteAdminReply
);
reviewRouter.delete("/delete-review/:id", verifyToken, deleteReview);

module.exports = reviewRouter;
