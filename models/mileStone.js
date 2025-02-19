const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel", // Reference to the user model
      required: true, // Make user_id required
    },
    milestones: [
      {
        milestone: {
          type: Number,
          required: true, // Milestone number (1, 2, 3, etc.)
        },
        start_date: {
          type: Date,
          required: true, // Start date of the milestone
        },
        end_date: {
          type: Date,
          required: true, // End date of the milestone
        },
        duration: {
          type: Number,
          required: true, // Duration in months
        },
        goals: {
          type: Map,
          of: String, // Store the goals as key-value pairs
        },
        kpis: {
          type: Map,
          of: String, // Store the KPIs as key-value pairs
        },
        techverse: {
          type: Map,
          of: String, // Store the courses or tech areas as key-value pairs
        },
        provision: {
          type: Map,
          of: String, // Store provisions like soft skills
        },
        bookvault: {
          type: Map,
          of: String, // Store recommended books
        },
        skillforge: {
          type: Map,
          of: String, // Store certifications
        },
        jobsphere: {
          type: Map,
          of: String, // Store job-related activities
        },
        eventpulse: {
          type: Map,
          of: String, // Store events/webinars
        },
        mentorloop: {
          type: Map,
          of: String, // Store mentorship activities
        },
        netx: {
          type: Map,
          of: String, // Store networking activities
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("mileStone", roadmapSchema);
