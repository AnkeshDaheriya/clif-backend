const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "programming",
      "data-science",
      "web-development",
      "mobile-development",
      "cloud-computing",
      "networking",
      "cyber-security",
      "artificial-intelligence",
    ],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalModules: {
    type: Number,
    required: true,
    min: 1,
  },
  language: {
    type: String,
    required: true,
    enum: ["Hindi", "English"],
  },
  initialRating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ["All Levels", "Beginner", "Intermediate", "Advanced"],
  },
  thumbnail: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
