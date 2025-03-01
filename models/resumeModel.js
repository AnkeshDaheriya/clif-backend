const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  resume_data: { type: Object, required: true },
});

// Mongoose Model
const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
