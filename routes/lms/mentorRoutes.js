const exp = require('express');
const { getAllMentor } = require('../../controllers/lms/mentorController');
const router = exp.Router();

router.post('/get-mentor',getAllMentor);

module.exports.mentorRouter = router;