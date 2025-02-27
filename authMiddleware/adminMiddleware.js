const jwt = require("jsonwebtoken");

// Middleware to verify JWT token

const roleCheck = async (req, res, next) => {
  try {
    // console.log("$Headers",req.headers.authorization)
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Access denied. No token provided.",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Admin" && decoded.role !=='Mentor')  {
      return res.status(403).json({
        status: 403,
        message: "Access denied.",
        success: false,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "something went wrong",
        error : error
       });
  }
};

module.exports.roleCheck = roleCheck;
