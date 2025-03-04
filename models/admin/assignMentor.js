const mongoose = require("mongoose");

const assignedMentor = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigned_at: {
      type: Date,
      default: Date.now(),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssignedMentor", assignedMentor);