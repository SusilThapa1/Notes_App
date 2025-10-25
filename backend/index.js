const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const { upload, profile } = require("./middlewares/file");
const cookieParser = require("cookie-parser");
const { globalLimiter } = require("./Utils/rateLimiter");

const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");
const programmeRouter = require("./Routes/programmeRoutes");
const uploadRouter = require("./Routes/uploadRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");
const universityRouter = require("./Routes/universityRoutes");

require("./config/cronConfig");

const app = express();
const PORT = 5001;

connectDB();

//  Allowed frontend URL
const allowedOrigins = process.env.FRONTEND_BASE_URL;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/", globalLimiter);

//  Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profiles", express.static(path.join(__dirname, "profiles")));

//  Base route
app.get("/", (req, res) => {
  res.send("Hello from server 🚀");
});

//  1. Single Dynamic Upload Route
app.post("/uploads/:type", verifyToken, (req, res, next) => {
  const { type } = req.params;
  console.log(type);
  let fileMiddleware;

  // choose where to store based on file type
  if (["images", "notes", "questions", "syllabus"].includes(type)) {
    fileMiddleware = upload.single(type);
  } else {
    return res.status(400).json({ success: 0, message: "Invalid upload type" });
  }

  // run multer middleware
  fileMiddleware(req, res, (err) => {
    if (err) {
      console.log(err.message);
      return res
        .status(400)
        .json({ success: 0, message: "wow  :" + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    res.status(200).json({
      success: 1,
      message: `${type} uploaded successfully`,
      data: {
        fileUrl: `/uploads/${type}/${req.file.filename}`,
        originalName: req.file.originalname,
      },
    });
  });
});

//  2. Profile Upload Route
app.post("/profiles", profile.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.status(200).json({
    success: 1,
    message: "Profile uploaded successfully",
    imageUrl: `/profiles/images/${req.file.filename}`,
  });
});

//  3. API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/university", universityRouter);
app.use("/api/programme", programmeRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/review", reviewRouter);

//  4. Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on ${process.env.SERVER_BASE_URL}`);
});
