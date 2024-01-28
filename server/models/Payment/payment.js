const mongoose = require("mongoose");
const { Schema } = mongoose;

const Payment = new mongoose.Schema({
    transaction_id: {
        type: String,
        // required: true,
    },
    payment_status: {
        type: String,
        enum: ["Paid", "UnPaid"],
        required: true
    },
    payment_mode: {
        type: String,
        enum: ["PAP", "Online", "COD"],
        required: true
    },
    payment_throw: {
        type: String,
        enum: ["Cash", "Internal Gateway", 'External App'],
    },
    external_transaction_id: {
        type: String,
    },
    transaction_document:String,
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
const payment = mongoose.model('payment', Payment);
module.exports = payment;