let express = require("express");
const {
  userList,
  userDelete,
  userSingle,
  userUpdate,
  userSignUp,
  userLogin,
  logout,
  userUploadProfile,
} = require("../controllers/userController");
const { profile } = require("../middlewares/file");
const verifyToken = require("../middlewares/authMiddleware");

const userRouter = express.Router();
userRouter.post("/register", userSignUp);
userRouter.post("/login", userLogin);
userRouter.get("/view", verifyToken, userList);
userRouter.get("/single/:id", verifyToken, userSingle);
userRouter.put("/update/:id", verifyToken, userUpdate);
userRouter.put(
  "/profile/:id",
  verifyToken,
  profile.single("profile"),
  userUploadProfile
);
userRouter.delete("/delete/:id", verifyToken, userDelete);
userRouter.delete("/logout", logout);

module.exports = userRouter;
