const userModel = require("../../models/users");

const getUsers = async (req, res) => {
  try {
      const users = await userModel.find();
      if (users) {
        return res.json({
          status: 200,
          data: users,
          message: "Users fetched successfully",
          success: true,
        });
      } else {
        return res.json({
          status: 404,
          message: "Users not found",
          success: false,
        });
      }
  } catch (err) {
    console.error("Error getting users:", err);
    return res.json({
      status: 500,
      message: "internal server error (getting user)",
    });
  }
};

module.exports.getUsers = getUsers;
