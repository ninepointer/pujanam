const mongoose = require("mongoose");
const { Schema } = mongoose;

const Pooja = new mongoose.Schema({
    pooja_name: {
        type: String,
        required: true,
    },
    pooja_description: [
        {
            type: String,
        }
    ],
    pooja_includes: {
        type: String,
        required: true,
    },
    purpose_of_pooja: [
        {
            type: String,
        }
    ],
    benefits_of_pooja: [
        {
            type: String,
        }
    ],
    pooja_image: {
        url: {type: String},
        name: {type: String}
    },
    pooja_items: [
        {
            type: String,
        }
    ],
    pooja_duration: {
        type: Number
    },
    pooja_packages: [{
        tier: {
            type: Schema.Types.ObjectId,
            ref: "tier"
        },
        price: {type: Number}
    }],
    pooja_type: {
        type: String,
        enum: ['Home', 'Online'],
        required: true
    },
    status: {
        type: String,
        enum: ['Published', 'Unpublished'],
        default: 'Published',
        required: true
    },
    faq: [{
        question: {type: String},
        answer: {type: String}
    }],
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
const PoojaSchema = mongoose.model('pooja', Pooja);
module.exports = PoojaSchema;