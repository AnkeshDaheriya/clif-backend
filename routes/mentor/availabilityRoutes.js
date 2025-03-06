const express = require("express");
const { addAvailability, getAvailability, deleteAvailability } = require("../../controllers/mentor/availabilityController");

const router = express.Router();

router.post("/add-availability", addAvailability);
router.get("/get-availability", getAvailability);
router.delete("/:id", deleteAvailability);

module.exports = router;
