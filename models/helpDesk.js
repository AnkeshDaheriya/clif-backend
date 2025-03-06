const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true },
  message: { type: "string", required: true },
});

module.exports = mongoose.model("helpCenter", helpSchema);
