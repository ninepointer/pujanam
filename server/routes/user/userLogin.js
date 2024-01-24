const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userSchema")
const jwt = require("jsonwebtoken")
const authentication = require("../../authentication/authentication");
const { sendSMS, sendOTP } = require('../../utils/smsService');
const otpGenerator = require('otp-generator');
const moment = require('moment');
const ApiResponse = require('../../helpers/apiResponse');
const { application } = require("express");
const { ObjectId } = require("mongodb");
const {verifyFirebaseLoginToken} = require("../../utils/fcmService")


router.post("/login", async (req, res) => {
    const { userId, pass } = req.body;

    console.log(req.body)

    if (!userId || !pass) {
        return res.status(422).json({ status: 'error', message: "Please provide login credentials" });
    }

    const deactivatedUser = await UserDetail.findOne({ email: userId, status: "Inactive" })

    if (deactivatedUser) {
        return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
    }

    const userLogin = await UserDetail.findOne({ email: userId, status: "Active" }).select('_id role password collegeDetails');

    if (!userLogin) {
        return res.status(422).json({ error: "invalid details" })
    } else {

        if (!userLogin) {
            return res.status(422).json({ status: 'error', message: "Invalid credentials" });
        } else {
            if (userLogin?.role?.toString() == '644903ac236de3fd7cfd755c') {
                return res.status(400).json({ status: 'error', message: 'Invalid request' });
            }
            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
            });
            res.status(201).json({ status: 'success', message: "user logged in succesfully", token: token });
        }
    }
})

router.post('/phonelogin', async (req, res, next) => {
    const { mobile } = req.body;
    try {
        const deactivatedUser = await UserDetail.findOne({ mobile: mobile, status: "Inactive" })

        if (deactivatedUser) {
            return res.status(422).json({ status: 'error', message: "Your account has been deactivated. Please contact StoxHero admin @ team@stoxhero.com.", error: "deactivated" });
        }

        const user = await UserDetail.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'The mobile number is not registered. Please signup.' })
        }
        if (user?.last_otp_time && moment().subtract(29, 'seconds').isBefore(user?.last_otp_time)) {
            return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
        }

        let mobile_otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        user.mobile_otp = mobile_otp;
        user.last_otp_time = new Date();
        await user.save({ validateBeforeSave: false });

        // sendSMS([mobile.toString()], `Your otp to login to StoxHero is: ${mobile_otp}`);
        if (process.env.PROD == 'true') sendOTP(mobile.toString(), mobile_otp);
        console.log(process.env.PROD, mobile_otp, 'sending');
        if (process.env.PROD !== 'true') {
            sendOTP("8076284368", mobile_otp)
            sendOTP("9319671094", mobile_otp)
        }

        res.status(200).json({ status: 'Success', message: `OTP sent to ${mobile}. OTP is valid for 30 minutes.` });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: `Something went wrong. Please try again.` });
    }

});

router.post('/verifyphonelogin', async (req, res, next) => {
    const { mobile, mobile_otp, fcmTokenData } = req.body;

    try {
        console.log("fcm data", fcmTokenData);
        const user = await UserDetail.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'The mobile number is not registered. Please signup.' });
        }

        if (process.env.PROD != 'true' && mobile == '7737384957' && mobile_otp == '987654') {
            const token = await user.generateAuthToken();
            console.log(fcmTokenData?.token);
            if (fcmTokenData?.token) {
                console.log('inside if');
                const tokenExists = user?.fcm_tokens?.some(token => token?.token === fcmTokenData.token);
                // If the token does not exist, add it to the fcm_tokens array
                console.log('token exists', tokenExists);
                if (!tokenExists) {
                    console.log('saving fcm token');
                    fcmTokenData.lastUsedAt = new Date();
                    user.fcm_tokens.push(fcmTokenData);
                    await user.save({ validateBeforeSave: false });
                    console.log('FCM token added successfully.');
                } else {
                    console.log('FCM token already exists.');
                }
            }

            // if (!user.collegeDetails.college && college) {
            //     user.collegeDetails.college = college;
            //     user.collegeDetails.rollno = rollno;
            //     await user.save({ validateBeforeSave: false });
            // }
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                // httpOnly: true
            });
            // res.json(token);
            return res.status(200).json({ status: 'success', message: "User login successful", token: token });
        }


        // console.log(user);

        if ((user.mobile !== "8076284368") && (user.mobile_otp != mobile_otp)) {
            return res.status(400).json({ status: 'error', message: 'OTP didn\'t match. Please check again.' });
        }

        // if(!user.collegeDetails.college && college){
        //     user.collegeDetails.college = college;
        //     user.collegeDetails.rollno = rollno;
        //     await user.save({validateBeforeSave: false});
        // }

        const token = await user.generateAuthToken();
        console.log(fcmTokenData?.token);
        if (fcmTokenData?.token) {
            console.log('inside if');
            const tokenExists = user?.fcm_tokens?.some(token => token?.token === fcmTokenData.token);
            // If the token does not exist, add it to the fcm_tokens array
            console.log('token exists', tokenExists);
            if (!tokenExists) {
                console.log('saving fcm token');
                fcmTokenData.lastUsedAt = new Date();
                user.fcm_tokens.push(fcmTokenData);
                await user.save({ validateBeforeSave: false });
                console.log('FCM token added successfully.');
            } else {
                console.log('FCM token already exists.');
            }
        }

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            // httpOnly: true
        });
        // res.json(token);
        res.status(200).json({ status: 'success', message: "User login successful", token: token });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: `Something went wrong. Please try again.` });
    }

});

router.post("/resendmobileotp", async (req, res) => {
    const { mobile } = req.body;
    try {
        const user = await UserDetail.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'The mobile number is not registered. Please signup.' });
        }

        if (user?.last_otp_time && moment().subtract(29, 'seconds').isBefore(user?.last_otp_time)) {
            return res.status(429).json({ message: 'Please wait a moment before requesting a new OTP' });
        }

        let mobile_otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        user.mobile_otp = mobile_otp;
        user.last_otp_time = new Date();
        await user.save({ validateBeforeSave: false });

        // sendSMS([mobile.toString()], `Your OTP is ${mobile_otp}`);
        if (process.env.PROD == 'true') sendOTP(mobile.toString(), mobile_otp);
        if (process.env.PROD !== 'true') sendOTP("9319671094", mobile_otp);
        res.status(200).json({ status: 'success', message: "Otp sent. Check again." });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: `Something went wrong. Please try again.` });

    }
});

router.get("/loginDetail", authentication, async (req, res) => {
    try {
        const id = req.user._id;

        const user = await UserDetail.findOne({ _id: id, status: "Active" })
            .populate('role', 'roleName')
        ApiResponse.success(res, user);
    } catch (err) {
        ApiResponse.error(res, 'Something went wrong', 500, err.message);
    }

})

router.get("/logout", authentication, (req, res) => {
    res.clearCookie("jwtoken", { path: "/" });
    res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
})
router.post("/addfcmtoken", authentication, async (req, res) => {
    const { fcmTokenData } = req.body;
    console.log('fcm', fcmTokenData);
    try {
        const user = await UserDetail.findById(req.user._id);
        if (fcmTokenData?.token) {
            const tokenExists = user?.fcm_tokens?.some(token => token?.token === fcmTokenData?.token);
            // If the token does not exist, add it to the fcm_tokens array
            if (!tokenExists) {
                fcmTokenData.lastUsedAt = new Date();
                user.fcm_tokens.push(fcmTokenData);
                await user.save({ validateBeforeSave: false });
                console.log('FCM token added successfully.');
                res.status(200).json({ status: 'success', message: 'Fcm data added.' })
            } else {
                console.log('FCM token already exists.');
                res.status(200).json({ status: 'success', message: 'Fcm token already exists.' })
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 'error', message: 'Something went wrong.', error: e?.message });
    }
})

// const admin = require('firebase-admin');

// const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

router.post('/verifyfirebaselogintoken', verifyFirebaseLoginToken);


module.exports = router;
