const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");

const Mandir = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    slug:{
        type: String,
        required: true,
    },
    cover_image: {
        url: {type: String},
        name: {type: String}
    },
    dham: {
        type: Boolean,
        required: true,
        default: false
    },
    popular: {
        type: Boolean,
        required: true,
        default: false
    },
    morning_opening_time: {
        type: Date,
        required: true,
        get: (val) => moment(val).format("HH:mm"),
    },
    morning_closing_time: {
        type: Date,
        required: true,
        get: (val) => moment(val).format("HH:mm"),
    },
    evening_opening_time: {
        type: Date,
        required: true,
        get: (val) => moment(val).format("HH:mm"),
    },
    evening_closing_time: {
        type: Date,
        required: true,
        get: (val) => moment(val).format("HH:mm"),
    },
    devi_devta: {
        type: Schema.Types.ObjectId,
        ref: 'devi-devta'
    },
    address_details: {
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true
            },
            coordinates: {
                type: [Number],
                // required: true
            }
        },
        address: {
            type: String,
            // required: true,
        },
        pincode: {
            type: String,
            // required: true,
        },
        city: {
            type: String,
            // required: true,
        },
        state: {
            type: String,
            // required: true,
        },
        country: {
            type: String,
            required: true,
            default: "India"
        }
    },
    images: [{
        url: { type: String },
        name: { type: String },
    }],
    favourite: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    uniqueCount: [{
       ip: {type: String},
       isMobile: {type: Boolean},
       country: {type: String},
       time: {type: Date}
    }],
    viewCount: {
        type: Number,
        // required: true
    },
    uni: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    construction_year: {
        type: Number,
        required: true
    },
    pandit_mobile_number: {
        type: String,
        // required: true
    },
    pandit_full_name: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true
    },
    created_on: {
        type: Date,
        default: function () {
            return Date.now();
        }
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    last_modified_on: {
        type: Date,
        default: function () {
            return Date.now();
        }
    },
    last_modified_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});
const MandirSchema = mongoose.model('mandir', Mandir);
module.exports = MandirSchema;