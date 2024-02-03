const mongoose = require("mongoose");
const { Schema } = mongoose;

const mandirUserInteraction = new mongoose.Schema({
    mandir_post:{
        type:Schema.Types.ObjectId, 
        ref: 'mandir-post',
        // required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    interaction_type:{
        type:String,
        enum:['Reaction', 'Comment']
    },
    reaction:{
        type:Schema.Types.ObjectId,
        ref:'reaction'
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:'post-comment'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
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
const MandirUserInteractionSchema = mongoose.model('mandir-user-interaction', mandirUserInteraction);
module.exports = MandirUserInteractionSchema;