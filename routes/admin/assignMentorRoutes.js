const exp = require("express");
const {
  addAssignedMentor,
} = require("../../controllers/admin/assignMentorController");
const router = exp.Router();

router.post("/assign-mentor", addAssignedMentor);

module.exports.assignMentorRoutes = router;
