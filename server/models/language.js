const mongoose = require("mongoose");
const { Schema } = mongoose;

const Language = new mongoose.Schema({
    language_name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true
    },
    created_on:{
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
const LanguageSchema = mongoose.model('language', Language);
module.exports = LanguageSchema;