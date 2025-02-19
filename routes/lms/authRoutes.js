// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  signup,
  loginUser,
  changePassword,
} = require("./../../controllers/lms/authController");
router.post("/signup", signup);
router.post("/login", loginUser);
router.put("/change-password", changePassword);
module.exports = router;
