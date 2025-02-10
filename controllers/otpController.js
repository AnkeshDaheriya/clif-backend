const crypto = require("crypto");
const { sendOtpEmail } = require("../helper/emailService");

// In-memory storage for OTPs (Not Persistent)
const otpStore = {};

// Function to generate a 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP (Without Database)
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Store OTP in memory
    otpStore[email] = { otp, expiresAt };

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verify OTP (Without Database)
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const storedOtpData = otpStore[email];

    if (!storedOtpData) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    // Check OTP expiry
    if (storedOtpData.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Delete OTP after successful verification
    delete otpStore[email];

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { sendOtp, verifyOtp };
