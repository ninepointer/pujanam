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
    poojaIncludes: {
        type: String,
        required: true,
    },
    purposeOfPooja: [
        {
            type: String,
        }
    ],
    benefitsOfPooja: [
        {
            type: String,
        }
    ],
    poojaImage: {
        url: {type: String},
        name: {type: String}
    },
    poojaItems: [
        {
            type: String,
        }
    ],
    poojaDuration: {

    },
    poojaPackages: {
        tier: {
            type: Schema.Types.ObjectId,
            ref: "tier"
        },
        price: {type: Number}
    },
    poojaType: {
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
    createdOn: {
        type: Date,
        default: function() {
          return Date.now();
        }
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    lastModifiedOn: {
        type: Date,
        default: function() {
            return Date.now();
        }
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});
const PoojaSchema = mongoose.model('pooja', Pooja);
module.exports = PoojaSchema;