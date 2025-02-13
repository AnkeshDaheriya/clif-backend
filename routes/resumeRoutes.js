<<<<<<< HEAD
const exp = require("express");
const router = exp.Router();
const { upload } = require("../helper/pdfUpload");
const { uploadResume } = require("../controllers/resumeController");
router.post("/upload", upload.single("resume"), uploadResume);
=======
const express = require("express");
const router = express.Router();
const { upload } = require("../helper/pdfUpload"); // Assuming this is the file handling logic
const { singleResumeUpload } = require("../controllers/singleResumeController"); // The controller function

// POST route to handle resume upload
router.post("/upload", upload.single("resume"), singleResumeUpload);
>>>>>>> 90fda61a17782cb4efd37b80fc56526df05a60fc

module.exports = router;
