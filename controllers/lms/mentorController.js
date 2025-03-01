const UserModel = require("../../models/lms/User");
const getAllMentor = async (req, res) => {
  try {
    const mentors = await UserModel.find({
      userType: "Instructor",
    });
    console.log("Mentor list", mentors);

    return res.json({
      success: true,
      message: "Mentors fetched successfully",
      data: mentors,
    });
  } catch (err) {
    console.log("Error fetching mentors", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getAllMentor = getAllMentor;
