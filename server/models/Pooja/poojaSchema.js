const mongoose = require("mongoose");
const { Schema } = mongoose;

const Pooja = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    includes: [
        {
            type: String,
        }
    ],
    purpose: [
        {
            type: String,
        }
    ],
    benefits: [
        {
            header: {type: String},
            description: {type: String},
        }
    ],
    image: {
        url: {type: String},
        name: {type: String}
    },
    items: [
        {
            name: {type: String},
            quantity: {type: Number},
            unit: {type: String},
        }
    ],
    duration: {
        type: Number
    },
    packages: [{
        tier: {
            type: Schema.Types.ObjectId,
            ref: "tier"
        },
        price: {type: Number}
    }],
    type: {
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