const mongoose = require("mongoose");
const { Schema } = mongoose;

const Pandit = new mongoose.Schema({
    pandit_name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    experience_in_year: {
        type: Number,
        required: true,
    },
    address_details: [
        {
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
                // required: true,
            }
        }
    ],
    dob: {
        type: Date,
        required: true
    },
    onboarding_date: {
        type: Date,
        required: true
    },
    pooja: [
        {
            type: Schema.Types.ObjectId,
            ref: 'pooja'
        }
    ],
    description: {
        type: String,
        required: true
    },
    additional_information:  [
        {
            type: String,
        }
    ],
    language: [
        {
            type: Schema.Types.ObjectId,
            ref: 'language'
        }
    ],

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true
    },
    created_on: {
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    created_by:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    last_modified_on:{
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    last_modified_by:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});
const PanditSchema = mongoose.model('pandit', Pandit);
module.exports = PanditSchema;