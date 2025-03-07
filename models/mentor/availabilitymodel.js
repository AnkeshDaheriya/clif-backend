const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    date: String,
    startTime: String,
    endTime: String,
});

module.exports = mongoose.model("Availability", availabilitySchema);