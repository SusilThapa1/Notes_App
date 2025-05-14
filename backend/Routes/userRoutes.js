let express = require("express");
const {
  userList,
  userDelete,
  userUpdate,
  userSignUp,
  userLogin,
  logout,
  userUploadProfile,
  userProfile,
  deleteProfileImage,
} = require("../controllers/userController");
const { profile } = require("../middlewares/file");
const verifyToken = require("../middlewares/authMiddleware");

const userRouter = express.Router();
userRouter.post("/register", userSignUp);
userRouter.post("/login", userLogin);
userRouter.get("/view", verifyToken, userList);
userRouter.get("/userprofile", verifyToken, userProfile);
userRouter.put("/update/:id", verifyToken, userUpdate);
userRouter.put(
  "/profile/:id",
  verifyToken,
  profile.single("image"),
  userUploadProfile
);
userRouter.delete("/profileimageDelete/:id", verifyToken, deleteProfileImage);
userRouter.delete("/delete/:id", verifyToken, userDelete);
userRouter.delete("/logout", logout);

module.exports = userRouter;
