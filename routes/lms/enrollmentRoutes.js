const express = require("express");
const router = express.Router();
const enrollmentController = require("../../controllers/lms/enrollmentController");

router.post("/enroll", enrollmentController.enrollCourse);
router.get("/user/:userId", enrollmentController.getUserEnrollments);
router.put("/:enrollmentId", enrollmentController.updateEnrollmentStatus);

module.exports = router;
