const emailService = require("../../utils/emailService")
const whatsAppService = require("../../utils/whatsAppService")
const otpGenerator = require('otp-generator')
const express = require("express");
const router = express.Router();
const path = require('path');
const mediaURL = "https://dmt-trade.s3.amazonaws.com/blogs/Vijay/photos/1702575002734logo.jpg";
// const mediaURL = require("../../../trading-app/src/assets/images/signup_whatsapp.png")
const mediaFileName = 'StoxHero'
require("../../db/conn");
const SignedUpUser = require("../../models/User/signedUpUser");
const User = require("../../models/User/userSchema")
const {sendSMS, sendOTP} = require('../../utils/smsService');
const uuid = require('uuid');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const {ObjectId} = require('mongodb')
const userController = require("../../controllers/userController");

router.post("/signup", async (req, res) => {
    const { full_name, email, mobile } = req.body;
    // console.log(req.body)
    if (!full_name || !email || !mobile) {
        return res.status(400).json({ status: 'error', message: "Please fill all fields to proceed." })
    }
    const isExistingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    if(isExistingUser){
        return res.status(400).json({
            message: "Your account already exists. Please login with mobile or email",
            status: 'error'
        });
    } 

    const signedupuser = await SignedUpUser.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    if (signedupuser?.last_otp_time && moment().subtract(29, 'seconds').isBefore(signedupuser?.last_otp_time)) {
        return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
      }
    let mobile_otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // User sign up detail saving
    try {
        if (signedupuser) {
            signedupuser.full_name = full_name.trim();
            signedupuser.mobile = mobile.trim();
            signedupuser.email = email.trim();
            signedupuser.mobile_otp = mobile_otp.trim();
            await signedupuser.save({ validateBeforeSave: false })
        } else {
            await SignedUpUser.create({
                full_name: full_name.trim(), email: email.trim(),
                mobile: mobile.trim(), mobile_otp: mobile_otp
            });
        }

        res.status(201).json({
            message: "OTP has been sent. Check your messages. OTP expires in 30 minutes.",
            status: 'success'
        });

        if(process.env.PROD == 'true'){
            sendOTP(mobile.toString(), mobile_otp);
        } else{
            sendOTP("9319671094", mobile_otp);
        }
        
    } catch (err) { console.log(err); res.status(500).json({ message: 'Something went wrong', status: "error" }) }
})

// async function generateUniqueReferralCode() {
//     const length = 8; // change this to modify the length of the referral code
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let myReferralCode = '';
//     let codeExists = true;

//     // Keep generating new codes until a unique one is found
//     while (codeExists) {
//         for (let i = 0; i < length; i++) {
//             myReferralCode += chars.charAt(Math.floor(Math.random() * chars.length));
//         }

//         // Check if the generated code already exists in the database
//         const existingCode = await User.findOne({ myReferralCode: myReferralCode });
//         if (!existingCode) {
//             codeExists = false;
//         }
//     }

//     return myReferralCode;
// }

router.patch("/verifyotp", userController.varifyOtp);



router.patch("/resendotp", async (req, res)=>{
    const {email, mobile, type} = req.body
    const user = await SignedUpUser.findOne({email: email})
    if(!user)
    {
        return res.status(404).json({
            status:'error',
            message: "User with this email doesnt exist"
        })
    }
    if (user?.last_otp_time && moment().subtract(29, 'seconds').isBefore(user?.last_otp_time)) {
        return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
      }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let mobile_otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    let subject = "OTP from StoxHero";
    let message = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email OTP</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }

            p {
                margin: 0 0 20px;
            }

            .otp-code {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }

            .cta-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }

            .cta-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Email OTP</h1>
            <p>Hello ${user.first_name},</p>
            <p>Your OTP code is: <span class="otp-code">${email_otp}</span></p>
            <p>Please use this code to verify your email address and complete your registration.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;
    if(type == 'mobile'){
        user.mobile_otp = mobile_otp;
        // sendSMS([mobile.toString()],`Your otp for StoxHero signup is ${mobile_otp}`);
        if(process.env.PROD=='true')sendOTP(mobile.toString(), mobile_otp);
       if(process.env.PROD!=='true')sendOTP("9319671094", mobile_otp);    
    }
    else if(type == 'email'){
        user.email_otp = email_otp;
        emailService(email,subject,message);
    }    
    await user.save();
    res.status(200).json({
            status:'success',
            message: "OTP Resent. Please check again."
    });
});

router.get("/signedupusers", Authenticate, restrictTo('Admin', 'SuperAdmin'), (req, res)=>{
    SignedUpUser.find()
    .sort({createdOn:-1})
    .exec((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.put("/updatesignedupuser/:id", Authenticate, async (req, res)=>{

    try{
        const {id} = req.params

        const signedupuser = await SignedUpUser.findOne({_id: id})

        signedupuser.status = req.body.Status,

        await signedupuser.save();
        res.status(201).json({message : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

module.exports = router;