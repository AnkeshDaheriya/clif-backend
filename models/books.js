const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
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
  milestone: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("booksTask", booksSchema);
