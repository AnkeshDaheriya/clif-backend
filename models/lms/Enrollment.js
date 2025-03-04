const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "completed", "dropped"],
    default: "active",
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completedModules: {
    type: [String],
    default: [],
  },
  lastAccessedDate: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
