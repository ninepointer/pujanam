const mongoose = require("mongoose");
const { Schema } = mongoose;

const Booking = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    booking_date: {
        type: Date,
        required: true,
    },
    transaction_date: {
        type: Date,
        required: true,
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
    full_name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    booking_amount: {
        type: Number,
        required: true,
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    specific_product_id: {
        type: Schema.Types.ObjectId,
    },
    paymentDetails: {
        type: Schema.Types.ObjectId,
        ref: 'payment'
    },
    pandits: {
        type: Schema.Types.ObjectId,
        ref: 'pandit'
    },
    tier: {
        type: Schema.Types.ObjectId,
        ref: 'tier'
    },
    coupon_code: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        enum: ['Success', 'Failed'],
        default: 'Success',
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
const BookingSchema = mongoose.model('booking', Booking);
module.exports = BookingSchema;