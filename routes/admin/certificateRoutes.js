const exp = require('express');
const { addCertificate, getCertificates } = require('../../controllers/admin/certificateController');
const router = exp.Router();

router.post('/add-certificate',addCertificate);
router.get('/get-certificates',getCertificates);

module.exports.certificateRouter = router;