
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Tier = new mongoose.Schema({
    tier_name: {
        type: String,
        required: true,
    },
    pooja_items_included: {
            type: Boolean,
            required: true
    },
    post_pooja_cleanUp_included: {
        type: Boolean,
        required: true
    },
    min_pandit_experience: {
        type: Number,
        required: true
    },
    max_pandit_experience: {
        type: Number,
        required: true
    },
    number_of_main_pandit: {
        type: Number,
        required: true
    },
    number_of_assistant_pandit: {
        type: Number,
        required: true
    },
    pandits: [
        {
            type: Schema.Types.ObjectId,
            ref: 'pandit'
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
    last_modified_on: {
        type: Date,
        default: function() {
            return Date.now();
        }
    },
    last_modified_by:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});
const TierSchema = mongoose.model('tier', Tier);
module.exports = TierSchema;