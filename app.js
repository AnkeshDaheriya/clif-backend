var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const https = require("https");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { ConnectDB } = require("./config/db.js");
const uploadRoutes = require("./routes/resumeRoutes.js");
const authRoutes = require("./routes/authRoute.js");
const otpRoutes = require("./routes/otpRoute.js");
const { mileStoneRouter } = require("./routes/mileStone.js");
const adminRoutes = require("./routes/admin/adminRoutes.js");
const mentorRoutes = require("./routes/admin/mentorRoutes.js");
const bcrypt = require("bcrypt");
const WebSocket = require("ws");
var app = express();
const multer = require("multer");
const lmsRoutes = require("./routes/lms/authRoutes.js");
const authRoute = require("./routes/authRoute.js");
const courseRoutes = require("./routes/lms/courseRoutes.js");
const moduleRoutes = require("./routes/lms/moduleRoutes.js");
const videoRoutes = require("./routes/lms/videoRoutes.js");
const bodyParser = require("body-parser");
// const scrapeRoutes = require("./routes/scrape");
const linkedinRoutes = require("./routes/linkedinRoutes");
const { mentorRouter } = require("./routes/lms/mentorRoutes.js");

app.use(cors()); // ✅ Enable CORS before routes
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Ensure upload directories exist dynamically
const uploadDirs = ["uploads", "uploads/mentors", "uploads/recorded"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ✅ Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes("/api/mentors")) {
      cb(null, "uploads/mentors");
    } else if (req.originalUrl.includes("/api/analyze")) {
      cb(null, "uploads/recorded");
    } else {
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    req.originalUrl.includes("/api/mentors") ||
    req.originalUrl.includes("/api/cofounders")
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image file."), false);
    }
  } else {
    cb(null, true);
  }
};

// ✅ Initialize Multer Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 5MB limit
});

// ✅ Enable CORS Before Routes
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://uat.clif.ai",
        "https://clif.ai",
        "https://www.uat.clif.ai",
        "https://www.clif.ai",
      ]
    : ["http://localhost:3000", "http://localhost:3001"]; // Development origins

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Video Analysis Route
app.post("/api/analyze", upload.single("video"), (req, res) => {
  if (!req.file) {
    console.error("Error: No file uploaded.");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const videoPath = path.join(__dirname, req.file.path);
  console.log(`Processing video: ${videoPath}`);

  const python = spawn("python", ["analyze.py", videoPath]);

  let output = "";
  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
  });

  python.on("close", (code) => {
    fs.unlinkSync(videoPath); // Cleanup
    if (code === 0) {
      console.log("AI Analysis Successful.");
      res.json(JSON.parse(output));
    } else {
      console.error("AI Analysis Failed.");
      res.status(500).json({ error: "Error processing video" });
    }
  });
});

// ✅ Debugging Middleware to Log Requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ WebSocket Server (Avoid Frontend Port Conflict)
const wss = new WebSocket.Server({ port: 3002, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });
});

// ✅ Connect to Database
ConnectDB();

// ✅ Define Routes
app.use("/auth", authRoutes);
app.use("/resume", uploadRoutes);
app.use("/auth", otpRoutes);
app.use("/mileStone", mileStoneRouter);
app.use("/api/auth", require("./routes/lms/authRoutes.js"));
app.use("/api/courses", require("./routes/lms/courseRoutes.js"));
app.use("/api/modules", require("./routes/lms/moduleRoutes.js"));
app.use("/api/videos", require("./routes/lms/videoRoutes.js"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin/api/admin", adminRoutes);
app.use("/admin/api/mentors", mentorRoutes(upload));

app.use("/linkedin", linkedinRoutes);
// ✅ Test Route (Check if the server is running)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// admin routes 
app.use("/admin/api", mentorRouter );


// ✅ 404 Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ HTTPS Setup (Production Only)
if (process.env.NODE_ENV === "production") {
  const SSL_KEY_PATH = "/etc/letsencrypt/live/uat.clif.ai/privkey.pem";
  const SSL_CERT_PATH = "/etc/letsencrypt/live/uat.clif.ai/fullchain.pem";

  if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    const httpsOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    };

    const PORT = process.env.PORT || 5000;
    const HOST = "0.0.0.0";

    https.createServer(httpsOptions, app).listen(PORT, HOST, () => {
      console.log(`✅ Server is running securely on https://${HOST}:${PORT}`);
    });
  } else {
    console.error("❌ SSL certificates not found. Please check your paths.");
    process.exit(1);
  }
} else {
  // ✅ Fallback to HTTP for Development
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`✅ Server is running on http://${HOST}:${PORT}`);
  });
}
