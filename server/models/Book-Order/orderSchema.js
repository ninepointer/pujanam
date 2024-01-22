const mongoose = require("mongoose");
const { Schema } = mongoose;

const Order = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    order_date: {
        type: Date,
        required: true,
    },
    transaction_date: {
        type: Date,
        // required: true,
    },
    reject_message: {
        type: String,
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
        house_or_flat_no: {
            type: String,
            // required: true,
        },
        floor: {
            type: String,
            // required: true,
        },
        locality: {
            type: String,
            // required: true,
        },
        landmark: {
            type: String,
            // required: true,
        },
        tag: {
            type: String,
            required: true,
            default: "Home"
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
    mobile: {
        type: String,
        required: true,
    },
    item_details: [{
        order_amount: {
            type: Number,
            required: true,
        },
        order_quantity: {
            type: Number,
            required: true,
        },
        category_id: {
            type: Schema.Types.ObjectId,
            ref: 'item-category'
        },
        item_id: {
            type: Schema.Types.ObjectId,
            ref: 'item'
        },
    }],
    payment_details: {
        type: Schema.Types.ObjectId,
        ref: 'payment'
    },
    coupon_code: {
        type: String,
        // required: true,
    },
    expected_deliver_time: {
        type: Number,
        // required: true,
    },
    order_no: {
        type: Number,
        // required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Confirmed', 'Completed', 'Rejected'],
        default: 'Pending',
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
const OrderSchema = mongoose.model('order', Order);
module.exports = OrderSchema;