const exp = require("express");
const router = exp.Router();
const authController = require("../controllers/userController");
router.post("/signUp", authController.userRegister);
router.post("/logIn", authController.userLogin);

module.exports.authRoutes = router;
