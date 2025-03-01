const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  personal_info: {
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false },
    location: { type: String, required: false },
    linkedin: { type: String, required: false },
    github: { type: String, required: false },
    portfolio: { type: String, required: false },
  },
  summary: { type: String, required: false },
  skills: {
    frontend: [{ type: String }],
    backend: [{ type: String }],
    database: [{ type: String }],
    devops_tools: [{ type: String }],
    other: [{ type: String }],
  },
  experience: [
    {
      title: { type: String, required: false },
      company: { type: String, required: false },
      location: { type: String, required: false },
      start_date: { type: Date, required: false },
      end_date: { type: Date, required: false },
      responsibilities: [{ type: String }],
    },
  ],
  education: [
    {
      degree: { type: String, required: false },
      university: { type: String, required: false },
      year: { type: String, required: false },
    },
  ],
  projects: [
    {
      title: { type: String, required: false },
      technologies: [{ type: String }],
      description: { type: String, required: false },
    },
  ],
  certifications: [
    {
      name: { type: String, required: false },
      platform: { type: String, required: false },
      status: { type: String, default: "Completed" },
    },
  ],
  interests: [{ type: String }],
});

// Mongoose Model
const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
