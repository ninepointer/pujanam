const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const { bool } = require("sharp");

const Item = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    min_order_quantity: {
        type:Number,
        required:true
    },
    unit:{
        type:String,
        enum:['ml', 'Piece', 'Gms', 'Kg' ]
    },
    price:{
        type:Number,
        required:true,
    },
    featured:bool,
    sponsored:bool,
    description:{
        type:String
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'CategoryItem'
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
const ItemSchema = mongoose.model('Item', Item);
module.exports = ItemSchema;