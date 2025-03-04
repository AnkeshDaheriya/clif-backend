const mongoose = require('mongoose');

const CertificateSchema = new  mongoose.Schema({
    certificate_name: {
        type: String,
        required: true,
    },
    certificate_description: {
        type: String,
        required: true,
    },
    certificate_tags: {
        type: [String],
        default: [],
    },
    certificate_provider :{
        type : String,
        required : true,
    },
    certificate_link : {
        type : String,
        required : true,
    },
    duration : {
        type : String,
        required : true,
    },
    certificate_type :{
        type : String,
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false,
    }
},{
    timestamps : true,
})

module.exports = mongoose.model('Certificate', CertificateSchema);