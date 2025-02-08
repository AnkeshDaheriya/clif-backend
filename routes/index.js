var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.json({
    status: 200,
    message: "hello",
  });
});

module.exports = router;
