const express = require("express");
const router = express.Router();
const helpCenterController = require("../controllers/helpController");

// Define the route for submitting a help request
router.post("/submit", helpCenterController);

module.exports = router;
