const mongoose = require("mongoose");

const bookProgressSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminBooks",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  current_page: {
    type: Number,
  },
  progress: {
    type: String,
  },
  last_read: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookProgress", bookProgressSchema);
