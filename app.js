var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors"); // ✅ Import cors
const { ConnectDB } = require("./config/db.js");
const uploadRoutes = require("./routes/resumeRoutes.js");
const authRoutes = require("./routes/authRoute.js");
const otpRoutes = require("./routes/otpRoute.js");
const { mileStoneRouter } = require("./routes/mileStone.js");

const port = 5000;
var app = express();

app.use(cors()); // ✅ Enable CORS before routes
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
app.use('/mileStone',mileStoneRouter)
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

// ✅ Start the Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
