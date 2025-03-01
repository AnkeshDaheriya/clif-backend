const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  cid: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
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
});

module.exports = mongoose.model("videosTask", videoSchema);
