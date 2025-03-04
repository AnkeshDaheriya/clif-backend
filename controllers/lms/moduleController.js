const Module = require("../../models/lms/Module");
const Course = require("../../models/lms/Course");

exports.createModule = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Verify course exists and belongs to user
    const course = await Course.findOne({
      _id: courseId,
      userId: req.body.userId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }

    // Get current highest order number
    const lastModule = await Module.findOne({ courseId }).sort({ order: -1 });
    const order = lastModule ? lastModule.order + 1 : 1;

    const module = new Module({
      ...req.body,
      order,
    });

    await module.save();

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating module",
      error: error.message,
    });
  }
};

exports.getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({
      courseId: req.params.courseId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching modules",
      error: error.message,
    });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }
    res.json({ success: true, module });
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
