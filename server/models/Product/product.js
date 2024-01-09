const mongoose = require("mongoose");
// const { Schema } = mongoose;

const Product = new mongoose.Schema({
    product_name: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true
    },
});
const ProductSchema = mongoose.model('product', Product);
module.exports = ProductSchema;