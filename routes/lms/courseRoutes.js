const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/lms/courseController");

router.post("/create", courseController.createCourse);
router.get("/user/:userId", courseController.getCoursesByUserId);
router.delete("/:id", courseController.deleteCourse);
router.get("/category/:category", courseController.getCoursesByCategory);
router.get("/:courseId", courseController.getCourseDetails);

module.exports = router;
