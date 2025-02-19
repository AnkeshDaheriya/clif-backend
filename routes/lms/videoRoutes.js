const express = require("express");
const router = express.Router();
const multer = require("multer");
const videoController = require("../../controllers/lms/videoController");

const upload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1000MB max file size
  },
});

router.post("/upload", upload.single("video"), videoController.uploadVideo);
router.get("/module/:moduleId", videoController.getVideosByModule);

module.exports = router;
