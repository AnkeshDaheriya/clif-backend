const Video = require("../../models/lms/Video");
const Course = require("../../models/lms/Course");
const Module = require("../../models/lms/Module");
const Vimeo = require("vimeo").Vimeo;

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);

exports.uploadVideo = async (req, res) => {
  try {
    const { courseId, moduleId, title } = req.body;
    const videoFile = req.file;

    // Validate the incoming request
    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded",
      });
    }

    if (!courseId || !moduleId || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: courseId, moduleId, or title",
      });
    }

    // Verify course and module ownership
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

    const module = await Module.findOne({
      _id: moduleId,
      courseId,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // Get current highest order number for videos in this module
    const lastVideo = await Video.findOne({ moduleId }).sort({ order: -1 });
    const order = lastVideo ? lastVideo.order + 1 : 1;

    // Upload video to Vimeo
    const vimeoResponse = await new Promise((resolve, reject) => {
      client.upload(
        videoFile.path,
        {
          name: title,
          description: `Video for ${course.title} - ${module.name}`,
        },
        function (uri) {
          resolve(uri);
        },
        function (bytes_uploaded, bytes_total) {
          // Optional: log the upload progress (for debugging)
          console.log(`Uploaded ${bytes_uploaded} of ${bytes_total} bytes`);
        },
        function (error) {
          console.error("Vimeo upload error:", error);
          reject(error); // Reject the promise on error
        }
      );
    });

    // Extract Vimeo ID from URI
    const vimeoId = vimeoResponse.split("/").pop();

    // Create video record in the database
    const video = new Video({
      courseId,
      moduleId,
      title,
      vimeoId,
      order,
    });

    await video.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message,
    });
  }
};

exports.getVideosByModule = async (req, res) => {
  try {
    const videos = await Video.find({
      moduleId: req.params.moduleId,
    }).sort({ order: 1 });

    // Send list of videos for the module
    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching videos",
      error: error.message,
    });
  }
};
