const exp = require('express');
const { getMileStones } = require('../controllers/mileStoneController');
const router = exp.Router();

router.post('/getMileStones', getMileStones);

module.exports.mileStoneRouter = router;