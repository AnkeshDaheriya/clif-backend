const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({


  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleAuth; // Required only if not using Google login
    },
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Mentor", mentorSchema);
