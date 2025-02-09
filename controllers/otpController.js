require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Load environment variables
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

// OTP Schema
const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Automatically delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model("OTP", OTPSchema);

// Generate a secure random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send OTP function
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); // Hash OTP before storing

    // Store OTP in MongoDB with expiry
    await OTPModel.findOneAndUpdate(
      { email },
      { otp: hashedOTP, expiresAt: new Date(Date.now() + OTP_EXPIRY) },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: "your-app@domain.com",
      to: email,
      subject: "Your OTP Verification Code",
      html: `<h1>OTP Verification</h1><p>Your OTP is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ status: "success", message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to send OTP" });
  }
};

// Verify OTP function
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and OTP are required" });
    }

    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Incorrect OTP" });
    }

    await OTPModel.deleteOne({ email }); // Delete OTP after verification

    return res
      .status(200)
      .json({ status: "success", message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to verify OTP" });
  }
};

module.exports = { sendOTP, verifyOTP };
