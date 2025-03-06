const VideoProgress = require("../../models/lms/VideoProgress");
const Video = require("../../models/lms/Video");
const Module = require("../../models/lms/Module");
const Course = require("../../models/lms/Course");
const User = require("../../models/users");
const mongoose = require("mongoose");

exports.saveVideoProgress = async (req, res) => {
  try {
    const { userId, videoId, progress, currentTime, duration } = req.body;
    console.log("Saving progress:", {
      userId,
      videoId,
      progress,
      currentTime,
      duration,
    });

    // Validate input
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    // Find video and associated details
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const module = await Module.findById(video.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Sanitize progress
    const sanitizedProgress = Math.min(Math.max(progress || 0, 0), 100);

    // Upsert progress record
    const progressRecord = await VideoProgress.findOneAndUpdate(
      {
        user: userId,
        video: videoId,
      },
      {
        user: userId,
        video: videoId,
        module: module._id,
        course: course._id,
        progress: sanitizedProgress,
        currentTime: currentTime || 0,
        totalDuration: duration || 0,
        completed: sanitizedProgress >= 95,
        lastWatched: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log("Saved progress record:", progressRecord);

    res.status(200).json({
      success: true,
      data: progressRecord,
    });
  } catch (error) {
    console.error("Progress saving error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getVideoProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.query;

    // Validate input
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    const progressRecord = await VideoProgress.findOne({
      user: userId,
      video: videoId,
    });

    if (!progressRecord) {
      return res.status(200).json({
        success: true,
        progress: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: progressRecord,
    });
  } catch (error) {
    console.error("Progress retrieval error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
