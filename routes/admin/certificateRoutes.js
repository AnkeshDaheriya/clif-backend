const exp = require("express");
const {
  addCertificate,
  getCertificates,
  search,
  getCertificateById,
  updateCertificate,
  getCertificateProgress,
} = require("../../controllers/admin/certificateController");
const router = exp.Router();

router.post("/add-certificate", addCertificate);
router.get("/get-certificates", getCertificates);

router.post("/search", search);
router.post("/get-certificateById", getCertificateById);
router.post("/update-certificate-progress", updateCertificate);
router.post('/get-certificate-progress',getCertificateProgress);

module.exports.certificateRouter = router;
