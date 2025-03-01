var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
const https = require("https");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // ✅ Import cors
const { ConnectDB } = require("./config/db.js");
const uploadRoutes = require("./routes/resumeRoutes.js");
const authRoutes = require("./routes/authRoute.js");
const otpRoutes = require("./routes/otpRoute.js");
const { mileStoneRouter } = require("./routes/mileStone.js");
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

// Configure CORS based on environment
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

// Debugging Middleware to Log Requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const wss = new WebSocket.Server({ port: 3000, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });
});

// ✅ Connect to Database
ConnectDB();

// ✅ Define Routes
app.use("/auth", authRoute);
app.use("/resume", uploadRoutes);
app.use("/auth", otpRoutes);
app.use("/mileStone", mileStoneRouter);
app.use("/linkedin", linkedinRoutes);
// ✅ Test Route (Check if the server is running)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", lmsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/videos", videoRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// admin routes 
app.use("/admin/api", mentorRouter );


// ✅ 404 Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// HTTPS Setup (Production Only)
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
      console.log(`Server is running securely on https://${HOST}:${PORT}`);
    });
  } else {
    console.error("SSL certificates not found. Please check your paths.");
    process.exit(1);
  }
} else {
  // Fallback to HTTP for Development
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0";

  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
