const exp = require("express");
const router = exp.Router();
const { upload } = require("../helper/pdfUpload");
const { uploadResume } = require("../controllers/resumeController");
router.post("/upload", upload.single("resume"), uploadResume);

module.exports = router;
