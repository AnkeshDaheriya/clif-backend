const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const rateLimit = require("express-rate-limit");

// OTP Request Rate Limiter (max 3 requests per 15 minutes)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many OTP requests. Please try again later.",
});

// Middleware for input validation
const validateOTPRequest = (req, res, next) => {
  if (!req.body.email || !req.body.email.includes("@")) {
    return res
      .status(400)
      .json({ status: "error", message: "Valid email is required" });
  }
  next();
};

const validateOTPVerification = (req, res, next) => {
  if (!req.body.email || !req.body.otp) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and OTP are required" });
  }
  if (!/^\d{6}$/.test(req.body.otp)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid OTP format" });
  }
  next();
};

// OTP routes
router.post("/send-otp", otpLimiter, validateOTPRequest, otpController.sendOTP);
router.post("/verify-otp", validateOTPVerification, otpController.verifyOTP);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "OTP service is running",
  });
});

module.exports.otpRoutes = router; // Use consistent export
