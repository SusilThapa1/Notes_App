const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const userRouter = require("./Routes/userRoutes");
const semesterRouter = require("./Routes/semesterRoutes");
const programmeRouter = require("./Routes/programmeRoutes");
const uploadRouter = require("./Routes/uploadRoutes");
const upload = require("./middlewares/file");

const PORT = 5001;

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://192.168.1.22:5173", //frontend URL
    credentials: true, // Important for cookies
  })
);

// const allowedOrigins = [
//   "http://192.168.1.22:5173", // Your Vite frontend on desktop/mobile
//   "http://localhost:5173", // For dev in browser
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.use("/api/user", userRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/programme", programmeRouter);
app.use("/api/upload", uploadRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sever is running on address ${process.env.SERVER_BASE_URL}`);
});
