const Milestone = require("../models/mileStone");

const getMileStones = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }
  try {
    const mileStone = await Milestone.findOne({
      userID: userId,
    });
    if (mileStone) {
      return res.json({
        success: true,
        message: "MileStones fetched successfully",
        data: mileStone,
      });
    } else {
      return res.json({
        success: false,
        message: "No milestone found for this user",
      });
    }
  } catch (err) {
    console.log("Error fetching mileStones: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getMileStones = getMileStones;
