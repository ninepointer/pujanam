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
    created_on:{
        type: Date,
        default: function() {
          return Date.now();
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