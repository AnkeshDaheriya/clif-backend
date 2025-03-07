const exp = require("express");
const {
  addEvent,
  eventList,
  deleteEvent,
  searchEvent,
  getEvent,
  getEventProgress,
  updateEventProgress,
} = require("../../controllers/admin/adminEventController");
const router = exp.Router();

router.post("/add-event", addEvent);
router.get("/event-list", eventList);
router.post("/delete-event", deleteEvent);
router.post("/search", searchEvent);

// Event progress

router.post("/get-event", getEvent);
router.post("/get-event-progress", getEventProgress);
router.post("/update-event-progress", updateEventProgress);

module.exports.EventRoutes = router;
