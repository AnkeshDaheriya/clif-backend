const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    bid: {
      type: String,
      required: true,
      unique: true,
    },
    book_name: {
      type: String,
      required: true,
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodels",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    milestone: {
      type: Number,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("booksTask", booksSchema);
