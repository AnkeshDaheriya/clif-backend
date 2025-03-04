const exp = require("express");
const { addEvent, eventList } = require("../../controllers/admin/adminEventController");
const router = exp.Router();

router.post("/add-event", addEvent);
router.get("/event-list", eventList);

module.exports.EventRoutes = router;
