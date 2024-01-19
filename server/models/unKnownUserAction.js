const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActionSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    is_mobile: {
        type: Boolean,
        required: true,
        default: false
    },
    is_app: {
        type: Boolean,
        required: true,
        default: false
    },
    created_on:{
        type: Date,
        default: function() {
          return Date.now();
        }
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
            // required: true,
        }
    },
    actions: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product'
        },
        specific_product: {
            type: Schema.Types.ObjectId,
        },
        time: {
            type: Date,
            default: function() {
              return Date.now();
            }
        }
    }]
});
const Action = mongoose.model('unknown-user-action', ActionSchema);
module.exports = Action;