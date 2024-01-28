const mongoose = require("mongoose");
const { Schema } = mongoose;

const mandirPost = new mongoose.Schema({
    mandir:{
        type:Schema.Types.ObjectId, 
        ref: 'mandir',
        // required: true
    },
    photo: {
        url:String,
        name:String
    },
    video: {
        url:String,
        name:String
    },
    videoUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true
    },
    allowedComments:[{
        comment:{type:String}
    }],
    comments:[{
        comment:{type:String},
        commentedOn:{type:Date},
        commentBy:{type:Schema.Types.ObjectId, ref: 'user'}
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
const MandirPostSchema = mongoose.model('mandir-post', mandirPost);
module.exports = MandirPostSchema;