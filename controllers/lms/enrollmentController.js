const Enrollment = require("../../models/lms/Enrollment");
const Course = require("../../models/lms/Course");

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required",
      });
    }

    // Verify that the course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      enrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling in course",
      error: error.message,
    });
  }
};

// Get all enrollments for a user
exports.getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const enrollments = await Enrollment.find({ userId })
      .populate("courseId")
      .sort({ enrollmentDate: -1 });

    res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Error getting user enrollments:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user enrollments",
      error: error.message,
    });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status, progress, completedModules } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Update the fields if provided
    if (status) enrollment.status = status;
    if (progress !== undefined) enrollment.progress = progress;
    if (completedModules) enrollment.completedModules = completedModules;

    enrollment.lastAccessedDate = Date.now();

    await enrollment.save();

    res.json({
      success: true,
      message: "Enrollment updated successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating enrollment",
      error: error.message,
    });
  }
};
