const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs")
const { Schema } = mongoose;
require("../../db/conn");

const userSchema = new mongoose.Schema({
    uid:String,
    full_name:{
        type: String,
        required : true,
    },
    mobile:{
        type: String,
        required : true,
    },
    address_details: [
        {
            location: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                    required: true
                },
                coordinates: {
                    type: [Number],
                    // required: true
                }
            },
            address: {
                type: String,
                // required: true,
            },
            house_or_flat_no: {
                type: String,
                // required: true,
            },
            floor: {
                type: String,
                // required: true,
            },
            locality: {
                type: String,
                // required: true,
            },
            landmark: {
                type: String,
                // required: true,
            },
            tag: {
                type: String,
                required: true,
                default: "Home"
            },
            contact_name: {
                type: String,
                // required: true,
            },
            contact_number: {
                type: String,
                // required: true,
            },
            pincode: {
                type: String,
                // required: true,
            },
            city: {
                type: String,
                // required: true,
            },
            state: {
                type: String,
                // required: true,
            },
            country: {
                type: String,
                // required: true,
            }
        }
    ],
    email: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
        enum: ['Male', 'Female', 'Other']
    },
    language: {
        type: String,
        // required: true,
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'booking',
    }],
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    joining_date: {
        type: Date,
        default: ()=>new Date(),
        required: true,
    },
    last_login_date: {
        type: Date
    },
    created_on:{
        type: Date,
        default: ()=>new Date(),
        // required : true
    },
    last_modified_on:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    created_by:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        // required : true
    },
    marital_status:{
        type: String,
        // required: true
    },
    mobile_otp:{
        type: String,
    },
    joining_date:{
        type: Date,
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: 'role-detail',
        default: '659fdac630fa1324fb3d2688'
    },
    creation_process:{
        type: String,
        enum: ['Auto SignUp']
    },
    profile_photo:{url:String,name:String},
    last_logged_in_device:{
        device_type: String,
        device_details: String
    },
    last_otp_time: {
        type: Date,
    },
    fcm_tokens:[{
        token: String,
        brand: String,
        model: String,
        platform: String,
        os_version: String,
        created_at: {
            type: Date,
            default: ()=>new Date()
        },
        last_used_at:{
            type: Date,
        },
        tags: [{type: String}],
    }],
    favourite_mandirs: [{
        type: Schema.Types.ObjectId,
        ref: 'mandir',
    }],
    favourite_devi_devta: [{
        type: Schema.Types.ObjectId,
        ref: 'devi-devta',
    }],
    current_location: {
       latitude: {type: Number},
       longitude: {type: Number}
    },
    cart:[
        {
            itemId:{
                type:Schema.Types.ObjectId,
                ref:'Item'
            },
            quantity:Number,
            status:{
                type:String,
            }
        }
    ]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({token: token});
        return token;
    } catch (err){
        console.log(err, "err in userSchema");
    }
}

userSchema.pre('save', async function(next){
    // console.log("inside employee", this._id)
    if(!this.createdBy || this.isNew){
        this.createdBy = this._id;
        next();
    } else {
        next();
    }
});

const userPersonalDetail = mongoose.model("user", userSchema);
module.exports = userPersonalDetail;