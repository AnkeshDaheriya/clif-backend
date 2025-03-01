const express = require("express");
const router = express.Router();
const linkedinController = require("../controllers/linkedinController");
// Submit LinkedIn profile URL and fetch data
router.post("/fetch-profile", linkedinController.fetchLinkedInProfileData);

module.exports = router;
