const express = require("express");
const router = express.Router();
const progressController = require("../../controllers/lms/VideoProgressController");

// Save video progress
router.post("/video", progressController.saveVideoProgress);

// Get video progress
router.get("/video/:videoId", progressController.getVideoProgress);

module.exports = router;
