// routes/auth.js
const express = require("express");
const router = express.Router();
const {
    signup,
    loginUser,
} = require("./../../controllers/mentor/authControllers");
// const { getUsers } = require("../../controllers/lms/users");
// const { roleCheck } = require("../../authMiddleware/adminMiddleware");
router.post("/signup", signup);
router.post("/login", loginUser);

// get users --------------------------------
module.exports = router;
