const express = require("express");
const router = express.Router();
const moduleController = require("../../controllers/lms/moduleController");

router.post("/create", moduleController.createModule);
router.get("/course/:courseId", moduleController.getModulesByCourse);

router.get("/:moduleId", moduleController.getModuleById);

module.exports = router;
