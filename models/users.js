const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleAuth; // Required only if not using Google login
      },
      trim: true,
    },
    googleAuth: {
      type: Boolean,
      default: false, // Set to true when user logs in via Google
    },
    headshot: {
      type: String, // Store the file path/URL
      trim: true,
    },

    // Personal Information
    age: {
      type: String,
      required: false, // Make optional
    },
    phone_no: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    gender: {
      type: String,
      required: false, // Make optional
    },

    // Employment Information
    current_employer: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    desired_employer: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    current_location: {
      type: String,
      required: false, // Make optional
      trim: true,
    },

    // Education
    education: {
      type: String,
      required: false, // Make optional
    },
    yearOfCompletion: {
      type: Number,
      required: false, // Make optional
    },
    specialization: {
      type: String,
      trim: true,
    },

    // Location Preferences
    desiredLocationCountry: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    desiredLocationCity: {
      type: String,
      required: false, // Make optional
      trim: true,
    },

    // Professional Details
    professionalDomain: {
      type: String,
      required: false, // Make optional
    },
    currentRole: {
      type: String,
      required: false, // Make optional
    },
    currentSalary: {
      type: Number,
      required: false, // Make optional
    },
    desiredRole: {
      type: String,
      required: false, // Make optional
    },
    desiredSalary: {
      type: Number,
      required: false, // Make optional
    },

    // Additional Information
    linkedinUrl: {
      type: String,
      required: false, // Make optional
      trim: true,
    },
    fileUpload: {
      type: String, // Store the file path/URL
      required: false, // Make optional
      trim: true,
    },

    // Status Fields
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically handle createdAt and updatedAt
  }
);

module.exports = mongoose.model("userModel", userSchema);
