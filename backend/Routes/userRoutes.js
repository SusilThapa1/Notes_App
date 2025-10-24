let express = require("express");
const {
  userList,
  userDelete,
  userUpdate,
  userUploadProfile,
  userProfile,
  deleteProfileImage,
  userAccountDelete,
  changeRole,
} = require("../controllers/userController");
const { profile } = require("../middlewares/file");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const userRouter = express.Router();

// User profile routes (protected)
userRouter.get("/me", verifyToken, userProfile);
userRouter.patch("/update/:id", verifyToken, userUpdate);
userRouter.patch(
  "/profile/:id",
  verifyToken,
  profile.single("image"),
  userUploadProfile
);
userRouter.delete("/profileimageDelete/:id", verifyToken, deleteProfileImage);
userRouter.post("/delete", verifyToken, userAccountDelete);

// Admin routes
userRouter.get("/view", verifyToken, verifyAdmin, userList);
userRouter.delete("/delete/:id", verifyToken, verifyAdmin, userDelete);
userRouter.post("/change-role", verifyToken, verifyAdmin, changeRole);

module.exports = userRouter;
