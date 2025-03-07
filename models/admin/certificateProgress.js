const mongoose = require("mongoose");

const certificateProgress = new mongoose.Schema({
    certificateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true
    },
    date_completed: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('CertificateProgress', certificateProgress)