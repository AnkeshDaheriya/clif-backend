const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    event_description: {
      type: String,
      required: true,
    },
    event_data: {
      type: String,
      required: true,
    },
    event_time: {
      type: String,
      required: true,
    },
    event_type: {
      type: String,
      required: true,
    },
    event_link: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEnded: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("events", eventSchema);
