const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using SMTP (use Gmail, Outlook, or Mailtrap for testing)
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io", // Replace with your SMTP server (for Gmail: "smtp.gmail.com")
  port: 587, // 465 for SSL, 587 for TLS
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Set this in .env file
    pass: process.env.EMAIL_PASS, // Set this in .env file
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for verification is: ${otp}. It is valid for 5 minutes. <br/  >`,
      html: `<p>Your OTP for verification is: <strong>${otp}</strong>. It is valid for <strong>5 minutes</strong>.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOtpEmail };
