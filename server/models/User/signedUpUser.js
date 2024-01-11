const mongoose = require("mongoose");
const { Schema } = mongoose;

const signedUpUserSchema = new mongoose.Schema({

    full_name:{
        type: String,
        required : true
    },
    created_on:{
        type: Date,
        required: true,
        default: ()=>new Date(),
    },
    dob:{
        type: Date,
        // required: true,
    },
    last_modified_on:{
        type: Date,
        required: true,
        default: ()=>new Date(),
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    mobile_otp:{
        type: String,
        // required: true
    },
    lastOtpTime:Date,
    email_otp:{
        type: String,
        // required: true
    },
    status:{
        type: String,
        enum: ['OTP Verification Pending','OTP Verified','Approved','Rejected'],
        default:'OTP Verification Pending'
    }
  
})



const signedUpUser = mongoose.model("signedup_user", signedUpUserSchema);
module.exports = signedUpUser;

