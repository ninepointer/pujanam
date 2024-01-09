const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;
require("../../db/conn");

const userSchema = new mongoose.Schema({
    full_name:{
        type: String,
        required : true,
    },
    mobile:{
        type: String,
        required : true,
    },
    address: [
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
            pincode: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            }
        }
    ],
    email: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    language: {
        type: String,
        required: true,
    },
    bookings: [{
        bookingTime: {type: Date}
    }],
    status: {
        type: String,
        required: true,
        enum: ["Active", "Inactive"]
    },
    joining_date: {
        type: Date,
        default: ()=>new Date(),
        required: true,
    },
    last_login_date: {
        type: Date
    },
    createdOn:{
        type: Date,
        default: ()=>new Date(),
        // required : true
    },
    lastModified:{
        type: Date,
        default: ()=>new Date(),
        required : true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        // required : true
    },
    maritalStatus:{
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
        default: '644902f1236de3fd7cfd73a7'
    },
    creation_process:{
        type: String,
        enum: ['Auto SignUp']
    },
    profilePhoto:{url:String,name:String},
    lastLoggedInDevice:{
        deviceType: String,
        deviceDetails: String
    },
    fcmTokens:[{
        token: String,
        brand: String,
        model: String,
        platform: String,
        osVersion: String,
        createdAt: {
            type: Date,
            default: ()=>new Date()
        },
        lastUsedAt:{
            type: Date,
        },
        tags: [{type: String}],
    }]
})

// //Adding the ninepointer id before saving
// userSchema.pre('save', async function(next){
//     if (this.isModified('paidDetails') || this.isModified('activationDetails')) {
//         // Skip the pre-save logic for activationDate updates
//         return next();
//     }
//     // console.log("inside employee id generator code")
//     if(!this.employeeid || this.isNew){
//         const count = await this.constructor.countDocuments();
        
//         let userId = this?.email?.split('@')[0] || this?.email;
//         console.log("Count of Documents: ",userId, this?.email)
//         let userIds = await userPersonalDetail.find({employeeid:userId})
//         if(userIds.length > 0)
//         {
//              userId = userId.toString()+(userIds.length+1).toString()
//         }
//         this.employeeid = userId;
//         next();
//     } else {
//         next();
//     }
// });

// userSchema.pre("save", async function(next){
//     if(!this.isModified('password')){
//         return next();
//     } 
//     this.password = await bcrypt.hash(this.password, 10)
//     next();
// })

// userSchema.methods.correctPassword = async function (
//     candidatePassword,
//     userPassword
//   ) {
//     return await bcrypt.compare(candidatePassword, userPassword);
//   };

// generating jwt token
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
// userSchema.methods.changedPasswordAfter = function(JWTiat) {
//     if (this.passwordChangedAt) {
//         const changedTimeStamp = parseInt(
//             this.passwordChangedAt.getTime() / 1000, // Convert to UNIX timestamp
//             10
//         );
//         // console.log('changed at', this.passwordChangedAt);
//         return JWTiat < changedTimeStamp; // True if the password was changed after token issuance
//     }
//     // False means not changed
//     return false;
// };
const userPersonalDetail = mongoose.model("user", userSchema);
module.exports = userPersonalDetail;