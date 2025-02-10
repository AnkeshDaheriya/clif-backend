const exp = require("express");
const router = exp.Router();
const authController = require("../controllers/userController");

const { upload } = require("../helper/pdfUpload.js");

router.post(
  "/signup",
  upload.fields([
    { name: "headshot", maxCount: 1 },
    { name: "fileUpload", maxCount: 1 },
  ]),
  authController.userRegister
);

router.post("/logIn", authController.userLogin);
router.post("/google", authController.googleLogin);

module.exports = router; // ✅ Correct export
