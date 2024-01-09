const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestMasterSchema = new Schema({
    contestMaster:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    contestMasterMobile:{
        type: String,
        required: true,
    },
    stoxheroPOC:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'college',
        required: true,
    },
    status:{
        type:String,
        required: true,
        enum: ['Active','Inactive']
    },
    inviteCode:{
        type:String,
        required: true,
    },
    createdOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    lastModifiedOn:{
        type: Date,
        required : true,
        default: ()=>new Date(),
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    lastModifiedBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
})

const contestMasterData = mongoose.model("daily-contest-master", contestMasterSchema);
module.exports = contestMasterData;