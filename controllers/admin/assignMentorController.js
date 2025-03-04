const AssignMentor = require("../../models/admin/assignMentor");

const addAssignedMentor = async (req, res) => {
  const { mentor_id, user_id } = req.body;
  if (!mentor_id || !user_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newMentor = new AssignMentor({
      mentor_id: mentor_id,
      user_id: user_id,
    });

    await newMentor.save();
    return res.status(201).json({
      success: true,
      message: "Mentor assigned successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports.addAssignedMentor = addAssignedMentor;
