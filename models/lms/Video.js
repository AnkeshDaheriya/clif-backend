const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  vimeoId: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", videoSchema);
