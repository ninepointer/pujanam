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
        enum: ["COD", "Online"],
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
    }
});
const payment = mongoose.model('payment', Payment);
module.exports = payment;