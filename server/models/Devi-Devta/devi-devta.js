
const mongoose = require("mongoose");
const { Schema } = mongoose;

const DeviDevta = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum:["Male", "Female"]
    },
    image: {url:String,name:String},
    other_names: [{
        type: Schema.Types.ObjectId,
        ref: 'devi-devta'
    }],
    associated_devi_devta: [{
        type: Schema.Types.ObjectId,
        ref: 'devi-devta'
    }],
    description: {
        type: String,
        required: true,
    },
    favourite: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    geography: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
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
    last_modified_by: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});
const DeviDevtaSchema = mongoose.model('devi-devta', DeviDevta);
module.exports = DeviDevtaSchema;