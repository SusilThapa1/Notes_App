const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const path = require("path");
const userRouter = require("./Routes/userRoutes");
const semesterRouter = require("./Routes/semesterRoutes");
const programmeRouter = require("./Routes/programmeRoutes");
const uploadRouter = require("./Routes/uploadRoutes");
const { upload, profile } = require("./middlewares/file");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const Users = require("./models/userModel");

const PORT = 5001;

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://192.168.1.23:5173", //frontend URL ||"http://localhost:5173" 192.168.16.153   192.168.1.22 192.168.1.104 192.168.1.45
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

cron.schedule("*/10 * * * *", async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);

    const deletedUsers = await Users.deleteMany({
      isAccountVerified: false,
      createdAt: { $lt: oneMinuteAgo },
    });

    // if (deletedUsers.deletedCount > 0) {
    //   console.log(
    //     `[CRON] Deleted ${deletedUsers.deletedCount} unverified users`
    //   );
    // }
  } catch (err) {
    console.error(
      "[CRON ERROR] Failed to delete unverified users:",
      err.message
    );
  }
});

app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.status(200).json({
    success: 1,
    message: "Image uploaded successfully",
    imageUrl: `${process.env.SERVER_BASE_URL}/uploads/images/${req.file.filename}`,
  });
});

app.post("/profiles", profile.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.status(200).json({
    success: 1,
    message: "Profile uploaded successfully",
    imageUrl: `${process.env.SERVER_BASE_URL}/profiles/images/${req.file.filename}`,
  });
});

app.use("/api/user", userRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/programme", programmeRouter);
app.use("/api/upload", uploadRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sever is running on address ${process.env.SERVER_BASE_URL}`);
});
