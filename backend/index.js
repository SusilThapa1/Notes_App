const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const path = require("path");
const userRouter = require("./Routes/userRoutes");
const semesterRouter = require("./Routes/semesterRoutes");
const programmeRouter = require("./Routes/programmeRoutes");
const uploadRouter = require("./Routes/uploadRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const { upload, profile } = require("./middlewares/file");
const cookieParser = require("cookie-parser");
require("./config/cronConfig");

const PORT = 5001;

const app = express();

connectDB();

const allowedOrigins = process.env.FRONTEND_BASE_URL; // add your frontend URLs

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

 

// Apply rate limiting to /api/ endpoints
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 50, // Max 50 requests per IP per 1 minutes
    message: "Too many requests, please try again later.",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profiles", express.static(path.join(__dirname, "profiles")));

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.status(200).json({
    success: 1,
    message: "Image uploaded successfully",
    imageUrl: `/uploads/images/${req.file.filename}`,
  });
});

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

app.use("/api/user", userRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/programme", programmeRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/review", reviewRouter);
 

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sever is running on address ${process.env.SERVER_BASE_URL}`);
});
