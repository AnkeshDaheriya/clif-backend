const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eid: {
      type: String,
      required: true,
      unique: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodels",
      required: true,
    },
    milestone: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("eventsTask", eventSchema);
