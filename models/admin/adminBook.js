const mongoose = require("mongoose");

const adminBookSchema = new mongoose.Schema({
  book_name: {
    type: String,
    required: true,
  },
  book_author: {
    type: String,
    required: true,
  },
  total_pages: {
    type: Number,
    required: true,
  },
  book_type: {
    type: String,
    required: true,
  },
  book_description: {
    type: String,
    required: true,
  },
  book_tags: {
    type: [String],
    default: [],
  },
  book_file: {
    type: String,
    required: true,
    default: null,
  },
  isDeleted : {
    type : Boolean,
    default : false,
  },
  isRead : {
    type : Boolean,
    default : false,
  }
},{
  timestamps : true,
});

module.exports = mongoose.model("adminBooks", adminBookSchema);