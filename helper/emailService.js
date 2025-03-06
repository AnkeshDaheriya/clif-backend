const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server (for Gmail: "smtp.gmail.com")
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

const helpEmail = async (newRequest) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newRequest.email,
      subject: "Help Center - Request Received",
      text: `Dear ${newRequest.firstName} ${newRequest.lastName},\n\nWe have received your help request:\n"${newRequest.firstName} ${newRequest.lastName}"\n\nOur support team will get back to you soon.\n\nBest Regards,\nSupport Team`,
      html: `<p>Dear <strong>${newRequest.firstName} ${newRequest.lastName}</strong>,</p>
             <p>We have received your help request:</p>
             <blockquote>${newRequest.message}</blockquote>
             <p>Our support team will get back to you soon.</p>
             <p>Best Regards,</p>
             <p><strong>Support Team</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};
module.exports = { sendOtpEmail, helpEmail };
