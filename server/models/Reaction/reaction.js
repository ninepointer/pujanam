const mongoose = require("mongoose");
const { Schema } = mongoose;

const Reaction = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {url:String,name:String},
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
const ReactionSchema = mongoose.model('reaction', Reaction);
module.exports = ReactionSchema;