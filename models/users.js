const mongoose = require("mongoose");
const userModel = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  contact_no: {
    type: String,
    require: true,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("userModel", userModel);
