const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  milestones: { type: Object, required: true },
});

module.exports = mongoose.model("Milestone", milestoneSchema);
