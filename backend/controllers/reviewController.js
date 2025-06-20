const Users = require("../models/userModel");
const Review = require("../models/reviewModel");

const sendReview = async (req, res) => {
  const userId = req.userid;

  const { rating, message, date } = req.body;

  try {
    // Check if user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    const existingReview = await Review.findOne({ userId });

    if (existingReview) {
      return res.status(400).json({
        successs: 0,
        message:
          "You have already submitted review. You can now edit or delete the existing one.",
      });
    }

    // Create new review
    const newReview = new Review({
      userId: userId,
      rating,
      message,
      date,
    });

    await newReview.save();
    return res
      .status(200)
      .json({ success: 1, message: "Review sent successfully." });
  } catch (err) {
    console.error("Error sending review:", err.message);
    return res
      .status(500)
      .json({ success: 0, message: "Server error: " + err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ updatedAt: -1 })
      .populate("userId", "_id username profilepath");

    return res.status(200).json({
      success: 1,
      message: "Review fetched successfully",
      data: reviews,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    return res
      .status(500)
      .json({ success: 0, message: "Server error: " + err.message });
  }
};

const adminReply = async (req, res) => {
  const { replyText, date } = req.body;
  if (!replyText) {
    return res
      .status(400)
      .json({ success: 0, message: "Review reply message is missing" });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    review.reply = {
      text: replyText,
      repliedDate: date,
      repliedBy: {
        name: req.user.username,
        email: req.user.email,
        userId: req.user._id,
      },
    };
    await review.save();
    res
      .status(200)
      .json({ success: 1, message: "Reply added successfully", review });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, message, date } = req.body;

  if (!rating || !message) {
    return res
      .status(400)
      .json({ success: 0, message: "Please rating and write something" });
  }
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: 0, message: "Review not found" });
    }
    review.message = message;
    review.rating = rating;
    review.date = date;
    review.reply = "";

    await review.save();
    res.status(200).json({ success: 1, message: "Review edited successfully" });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

const deleteAdminReply = async (req, res) => {
  const adminId = req.user.id;
  const reviewId = req.params.id;

  try {
    const adminUser = await Users.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ success: 0, message: "User not found" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: 0, message: "Review not found" });
    }

    await Review.findByIdAndUpdate(reviewId, { $unset: { reply: "" } });

    res.status(200).json({
      success: 1,
      message: "Review reply deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res
        .status(400)
        .json({ success: 0, message: "Failed to delete your review" });
    }
    res.status(200).json({ success: 1, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

module.exports = {
  sendReview,
  getReviews,
  adminReply,
  updateReview,
  deleteAdminReply,
  deleteReview,
};
