const Course = require("../../models/lms/Course");
const Module = require("../../models/lms/Module");
const multer = require("multer");
const path = require("path");
const Video = require("../../models/lms/Video");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/course-thumbnails/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed!"));
  },
}).single("thumbnail");

exports.createCourse = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const courseData = {
        ...req.body,
        userId: req.body.userId, // Assuming this comes from the frontend
        thumbnail: `/uploads/course-thumbnails/${req.file.filename}`, // Fixed path
      };

      const course = new Course(courseData);
      await course.save();

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

exports.getCoursesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courses = await Course.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify user ownership
    if (course.userId !== req.body.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

exports.getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch course details
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Fetch all modules for the course
    const modules = await Module.find({ courseId }).sort({ order: 1 });

    // Fetch videos for each module and embed them inside their respective modules
    const modulesWithVideos = await Promise.all(
      modules.map(async (module) => {
        const videos = await Video.find({ moduleId: module._id }).sort({
          order: 1,
        });
        return { ...module.toObject(), videos };
      })
    );

    res.status(200).json({ success: true, course, modules: modulesWithVideos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
};
