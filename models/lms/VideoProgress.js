const mongoose = require("mongoose");

const VideoProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastWatched: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoProgress", VideoProgressSchema);
