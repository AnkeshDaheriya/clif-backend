const express = require("express");
const router = express.Router();
const { upload } = require("../helper/pdfUpload"); // File handling logic
const { singleResumeUpload } = require("../controllers/singleResumeController");
const { getResumedata } = require("../controllers/resumeController");

// POST route to handle resume upload
router.post("/upload", upload.single("resume"), singleResumeUpload);

// POST route to fetch resume data
router.post("/getResume", async (req, res) => {
  try {
    await getResumedata(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router; // ✅ Correct way to export
