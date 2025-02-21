const express = require("express");
const adminController = require("../../controllers/admin/adminController");
const router = express.Router();

router.post("/login", adminController.login);
router.post("/create", adminController.create);

module.exports = router;
