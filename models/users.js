const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
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
      required: true,
      trim: true,
    },
    headshot: {
      type: String, // Store the file path/URL
      trim: true,
    },

    // Personal Information
    age: {
      type: String,
      // enum: [
      //   "Below 18",
      //   "18 – 25",
      //   "26 – 34",
      //   "35 – 45",
      //   "45 – 55",
      //   "56 and above",
      // ],
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      // enum: ["Male", "Female", "Rather not specify"],
      required: true,
    },

    // Employment Information
    current_employer: {
      type: String,
      required: true,
      trim: true,
    },
    desired_employer: {
      type: String,
      required: true,
      trim: true,
    },
    current_location: {
      type: String,
      required: true,
      trim: true,
    },

    // Education
    education: {
      type: String,
      // enum: ["Undergrad", "Bachelors", "Masters", "Doctorate"],
      required: true,
    },
    yearOfCompletion: {
      type: Number,
      required: true,
    },
    specialization: {
      type: String,
      trim: true,
    },

    // Location Preferences
    desiredLocationCountry: {
      type: String,
      required: true,
      trim: true,
    },
    desiredLocationCity: {
      type: String,
      required: true,
      trim: true,
    },

    // Professional Details
    professionalDomain: {
      type: String,
      // enum: [
      //   "Technology",
      //   "Management",
      //   "Finance",
      //   "Content Creator",
      //   "Entrepreneurship",
      //   "Business Intelligence",
      //   "Venture Capital",
      // ],
      required: true,
    },
    currentRole: {
      type: String,
      // enum: [
      //   "Undergrad / Not Employed",
      //   "Entry Level / Intern",
      //   "Individual Contributor (Jr. Level)",
      //   "Individual Contributor (Sr. Level)",
      //   "Manager",
      //   "Sr. Manager",
      //   "Director / Assistant Vice President",
      //   "Vice President",
      //   "C-Suite (CEO/CFO/CMO & Similar)",
      //   "Chairperson / Board of Directors",
      // ],
      required: true,
    },
    currentSalary: {
      type: Number,
      required: true,
    },
    desiredRole: {
      type: String,
      // enum: [
      //   "Undergrad / Not Employed",
      //   "Entry Level / Intern",
      //   "Individual Contributor (Jr. Level)",
      //   "Individual Contributor (Sr. Level)",
      //   "Manager",
      //   "Sr. Manager",
      //   "Director / Assistant Vice President",
      //   "Vice President",
      //   "C-Suite (CEO/CFO/CMO & Similar)",
      //   "Chairperson / Board of Directors",
      // ],
      required: true,
    },
    desiredSalary: {
      type: Number,
      required: true,
    },

    // Additional Information
    linkedinUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileUpload: {
      type: String, // Store the file path/URL
      required: true,
      trim: true,
    },

    // Verification Fields
    otp: {
      type: String,
      trim: true,
    },
    otpVerified: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("userModel", userModel);
