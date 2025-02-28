// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  signup,
  loginUser,
  changePassword,
} = require("./../../controllers/lms/authController");
const { getUsers } = require("../../controllers/lms/users");
// const { roleCheck } = require("../../authMiddleware/adminMiddleware");
router.post("/signup", signup);
router.post("/login", loginUser);
router.put("/change-password", changePassword);

// get users --------------------------------
router.post("/getUsers", getUsers);
module.exports = router;
