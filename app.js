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

var app = express();

app.use(cors()); // ✅ Enable CORS before routes
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
      ] // Production origin
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

// ✅ Connect to Database
ConnectDB();

// ✅ Define Routes
app.use("/auth", authRoutes);
app.use("/resume", uploadRoutes);
app.use("/auth", otpRoutes);
app.use("/mileStone", mileStoneRouter);
// ✅ Test Route (Check if the server is running)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

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
