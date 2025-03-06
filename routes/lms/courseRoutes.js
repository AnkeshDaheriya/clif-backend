const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/lms/courseController");

router.post("/create", courseController.createCourse);
router.get("/user/:userId", courseController.getCoursesByUserId);
router.get("/search", courseController.searchCourse); // Moved this BEFORE the :courseId route
router.get("/category/:category", courseController.getCoursesByCategory);
router.delete("/:id", courseController.deleteCourse);
router.get("/:courseId", courseController.getCourseDetails);
module.exports = router;
