const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  resume_data: { type: Object, required: true },
});
// Mongoose Model
const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
