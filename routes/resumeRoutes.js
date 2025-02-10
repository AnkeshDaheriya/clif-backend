const exp = require("express");
const router = exp.Router();
const { upload } = require("../helper/pdfUpload");
const resume = require("../controllers/resumeController");

router.post("/upload", upload.single("resume"), resume.uploadResume);

module.exports = router;
