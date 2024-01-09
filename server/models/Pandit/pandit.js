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
    address_details:   {
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
    dob: {
        type: Date,
        required: true
    },
    onboarding_date: {
        type: Date,
        default: function () {
            return Date.now();
        },
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
    createdOn: {
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});
const PanditSchema = mongoose.model('pandit', Pandit);
module.exports = PanditSchema;