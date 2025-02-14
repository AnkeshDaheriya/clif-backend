const express = require("express");
const router = express.Router();
const { upload } = require("../helper/pdfUpload"); // Assuming this is the file handling logic
const { singleResumeUpload } = require("../controllers/singleResumeController"); // The controller function

// POST route to handle resume upload
router.post("/upload", upload.single("resume"), singleResumeUpload);

module.exports = router;
