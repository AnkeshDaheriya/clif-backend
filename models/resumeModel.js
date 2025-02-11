const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  personal_info: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
  },
  summary: { type: String, required: true },
  skills: {
    frontend: [{ type: String }],
    backend: [{ type: String }],
    database: [{ type: String }],
    devops_tools: [{ type: String }],
    other: [{ type: String }],
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      start_date: { type: Date, required: true },
      end_date: { type: Date },
      responsibilities: [{ type: String }],
    },
  ],
  education: [
    {
      degree: { type: String, required: true },
      university: { type: String, required: true },
      year: { type: String, required: true },
    },
  ],
  projects: [
    {
      title: { type: String, required: true },
      technologies: [{ type: String }],
      description: { type: String },
    },
  ],
  certifications: [
    {
      name: { type: String },
      platform: { type: String },
      status: { type: String, default: "Completed" },
    },
  ],
  interests: [{ type: String }],
});

// Mongoose Model
const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
