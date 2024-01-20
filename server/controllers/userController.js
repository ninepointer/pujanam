const multer = require('multer');
const AWS = require('aws-sdk');
const UserDetail = require('../models/User/userSchema');
const DeactivateUser = require('../models/User/deactivateUser');
const { ObjectId } = require('mongodb');
const sendMail = require('../utils/emailService');
const mongoose = require('mongoose');
const SignedUpUser = require("../models/User/signedUpUser");
const ApiResponse = require('../helpers/apiResponse');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
}

const upload = multer({
  storage, fileFilter
  // limits: {
  // fileSize: 1024 * 1024 * 10,
  // files: 1} 
}).single("profilePhoto");
const uploadMultiple = multer({
  storage, fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB maximum file size
  }
}).fields([{ name: 'profilePhoto', maxCount: 1 },
{ name: 'aadhaarCardFrontImage', maxCount: 1 }, { name: 'aadhaarCardBackImage', maxCount: 1 },
{ name: 'panCardFrontImage', maxCount: 1 }, { name: 'passportPhoto', maxCount: 1 },
{ name: 'addressProofDocument', maxCount: 1 }, { name: 'incomeProofDocument', maxCount: 1 }]);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const resizePhoto = async (req, res, next) => {
  // console.log('resize func');
  // console.log("Uploaded Files: ",req.files)
  if (!req.files) {
    // no file uploaded, skip to next middleware
    console.log('no file');
    next();
    return;
  }

  const { profilePhoto, aadhaarCardFrontImage, aadhaarCardBackImage, panCardFrontImage,
    passportPhoto, addressProofDocument, incomeProofDocument } = (req.files);

  // if (profilePhoto && profilePhoto[0].buffer) {
  //   const resizedProfilePhoto = await sharp(profilePhoto[0].buffer)
  //     .resize({ width: 500, height: 500 })
  //     .toBuffer();
  //   (req.files).profilePhotoBuffer = resizedProfilePhoto;
  // }

  // if (aadhaarCardFrontImage && aadhaarCardFrontImage[0].buffer) {
  //   const resizedAadhaarCardFrontImage = await sharp(aadhaarCardFrontImage[0].buffer)
  //     .resize({ width: 1024, height: 720 })
  //     .toBuffer();
  //   (req.files).aadhaarCardFrontImageBuffer = resizedAadhaarCardFrontImage;
  // }
  // if (aadhaarCardBackImage && aadhaarCardBackImage[0].buffer) {
  //   const resizedAadhaarCardBackImage = await sharp(aadhaarCardBackImage[0].buffer)
  //     .resize({ width: 1024, height: 720 })
  //     .toBuffer();
  //   (req.files).aadhaarCardBackImageBuffer = resizedAadhaarCardBackImage;
  // }

  // if (panCardFrontImage && panCardFrontImage[0].buffer) {
  //   const resizedPanCardFrontImage = await sharp(panCardFrontImage[0].buffer)
  //     .resize({ width: 1024, height: 720 })
  //     .toBuffer();
  //   (req.files).panCardFrontImageBuffer = resizedPanCardFrontImage;
  // }
  // if (passportPhoto && passportPhoto[0].buffer) {
  //   const resizedPassportPhoto = await sharp(passportPhoto[0].buffer)
  //     .resize({ width: 1024, height: 720 })
  //     .toBuffer();
  //   (req.files).passportPhotoBuffer = resizedPassportPhoto;
  // }
  // if (addressProofDocument && addressProofDocument[0].buffer) {
  //   const resizedAddressProofDocument = await sharp(addressProofDocument[0].buffer)
  //     .resize({ width: 1024, height: 720 })
  //     .toBuffer();
  //   (req.files).addressProofDocumentBuffer = resizedAddressProofDocument;
  // }
  // if (incomeProofDocument && incomeProofDocument[0].buffer) {
  //   const resizedIncomeProofDocument = await sharp(incomeProofDocument[0].buffer)
  //     // .resize({ width: 1000, height: 500 })
  //     .toBuffer();
  //   (req.files).incomeProofDocumentBuffer = resizedIncomeProofDocument;
  // }
  next();
};

const uploadToS3 = async (req, res, next) => {
  if (!req.files) {
    // no file uploaded, skip to next middleware
    console.log('no files bro');
    next();
    return;
  }

  try {
    if ((req.files).profilePhoto) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?._id}`;
      const key = `users/${userName}/photos/display/${Date.now() + (req.files).profilePhoto[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).profilePhotoBuffer,
        ContentType: (req.files).profilePhoto.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).profilePhotoUrl = s3Data.Location;
    }

    if ((req.files).aadhaarCardFrontImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/aadharFront/${Date.now() + (req.files).aadhaarCardFrontImage[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).aadhaarCardFrontImageBuffer,
        ContentType: (req.files).aadhaarCardFrontImage.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).aadhaarCardFrontImageUrl = s3Data.Location;
    }

    if ((req.files).aadhaarCardBackImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/aadharBack/${Date.now() + (req.files).aadhaarCardBackImage[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).aadhaarCardBackImageBuffer,
        ContentType: (req.files).aadhaarCardBackImage.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).aadhaarCardBackImageUrl = s3Data.Location;
    }
    if ((req.files).panCardFrontImage) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/panFront/${Date.now() + (req.files).panCardFrontImage[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).panCardFrontImageBuffer,
        ContentType: (req.files).panCardFrontImage.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).panCardFrontImageUrl = s3Data.Location;
    }
    if ((req.files).passportPhoto) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/passport/${Date.now() + (req.files).passportPhoto[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).passportPhotoBuffer,
        ContentType: (req.files).passportPhoto.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).passportPhotoUrl = s3Data.Location;
    }
    if ((req.files).addressProofDocument) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/addressProof/${Date.now() + (req.files).addressProofDocument[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).addressProofDocumentBuffer,
        ContentType: (req.files).addressProofDocument.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).addressProofDocumentUrl = s3Data.Location;
    }
    if ((req.files).incomeProofDocument) {
      let userName;
      const user = await UserDetail.findById(req.params.id);
      userName = `${user?.first_name}` + `${user?.last_name}` + `${user?.name}` + `${user?._id}`;
      const key = `users/${userName}/photos/incomeProof/${Date.now() + (req.files).incomeProofDocument[0].originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        region: process.env.AWS_REGION,
        Body: (req.files).incomeProofDocumentBuffer,
        ContentType: (req.files).incomeProofDocument.mimetype,
        ACL: 'public-read',
      };

      // upload image to S3 bucket
      const s3Data = await s3.upload(params).promise();
      // console.log('file uploaded');
      // console.log(s3Data.Location);
      (req).incomeProofDocumentUrl = s3Data.Location;
    }

    // console.log('calling next of s3 upload func');
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error uploading to S3' });
  }
};


// Controller for saving deactivated user
exports.deactivateUser = async (req, res) => {
  try {
    const { deactivatedUser, mobile, email, isMail, reason } = req.body;

    const user = await DeactivateUser.findOne({ deactivatedUser: new ObjectId(deactivatedUser) });

    if (user) {
      return res.status(500).json({
        status: 'error',
        message: "user is already deactivated.",
      });
    }

    const contest = await DeactivateUser.create({
      deactivatedUser, mobile, email, reason,
      createdBy: req.user._id, lastModifiedBy: req.user._id,
    });

    const updateUser = await UserDetail.findByIdAndUpdate(new ObjectId(deactivatedUser), {status: "Inactive"})

    // await client.del(`${deactivatedUser.toString()}authenticatedUser`);
    console.log(deactivatedUser)
    if(isMail){
      if (process.env.PROD == 'true') {
        sendMail(email, 'Account Deactivated - StoxHero', `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Account Deactivated</title>
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
  
            .userid {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .password {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .login-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }
  
            .login-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Account deactivation alert</h1>
            <p>Hello ${updateUser.first_name},</p>
            <p>Your account is being deactivated due to the following reason:</p>
            <p>${reason}</p>
            
            <p>If you believe your account is being deactivated wrongly due to some error or you have a valid explanation for the above deactivation reason, please reply to this mail or write to us at team@stoxhero.com</p>
            <br/><br/>
            <p>Thanks,</p>
            <p>StoxHero Team</p>
  
            </div>
        </body>
        </html>
        `);

        sendMail("team@stoxhero.com", 'Account Deactivated - StoxHero', `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Account Deactivated</title>
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
  
            .userid {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .password {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }
  
            .login-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }
  
            .login-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Account deactivation alert</h1>
            <p>Hello Admin,</p>
            <p>${updateUser.first_name + " " + updateUser.last_name} account is being deactivated due to the following reason:</p>
            <p>${reason}</p>
            
            <br/><br/>
            <p>Thanks,</p>
            <p>StoxHero Team</p>
  
            </div>
        </body>
        </html>
        `);
      }
    }

    // console.log(contest)
    res.status(201).json({
      status: 'success',
      message: "user deactivated successfully",
      data: contest
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: "Something went wrong",
      error: error.message
    });
  }
};

exports.varifyOtp = async (req, res) => {
  let {
    full_name,
    email,
    mobile,
    mobile_otp,
    fcmTokenData,
  } = req.body


  const user = await SignedUpUser.findOne({ mobile: mobile })
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: "User with this mobile number doesn't exist"
    })
  }
  //removed email otp check
  if ( (user.mobile_otp != mobile_otp)) {
    return res.status(400).json({
      status: 'error',
      message: "OTPs don't match, please try again!"
    })
  }

  const checkUser = await UserDetail.findOne({ mobile: user?.mobile });

  if (checkUser) {
    return res.status(400).json({
      status: 'error',
      message: "Account already exists with this mobile number."
    })
  }



  user.status = 'OTP Verified';
  user.last_modified_on = new Date();
  await user.save({ validateBeforeSave: false });

  // const myReferralCode = await generateUniqueReferralCode();
  // const count = await User.countDocuments();
  // let userId = email.split('@')[0]
  // let userIds = await UserDetail.find({ employeeid: userId })

  // if (userIds.length > 0) {
  //   userId = userId.toString() + (userIds.length + 1).toString()
  // }




  // free portfolio adding in user collection

  try {
    let creation = "Auto SignUp";

    let obj = {
      full_name: full_name.trim(), 
      email: email.trim(),
      mobile: mobile.trim(),
      status: 'Active',
      // employeeid: userId,
      joining_date: user.last_modified_on,
      // myReferralCode: (await myReferralCode).toString(),
      // referrerCode: referredBy && referrerCode,
      creation_process: creation,
    }

    if (fcmTokenData) {
      fcmTokenData.lastUsedAt = new Date();
      obj.fcmTokens = [fcmTokenData];
    }
    // console.log('password', password);
    // if(password){
    //     obj.password = password;
    // }

    const newuser = await UserDetail.create(obj);
    // await UserWallet.create(
    //     {
    //         userId: newuser._id,
    //         createdOn: new Date(),
    //         createdBy: newuser._id
    // })
    const populatedUser = await UserDetail.findById(newuser._id).populate('role', 'roleName')
      .select('pincode KYCStatus aadhaarCardFrontImage aadhaarCardBackImage panCardFrontImage passportPhoto addressProofDocument profilePhoto _id address city cohort country degree designation dob email employeeid first_name fund gender joining_date last_name last_occupation location mobile myReferralCode name role state status trading_exp whatsApp_number aadhaarNumber panNumber drivingLicenseNumber passportNumber accountNumber bankName googlePay_number ifscCode nameAsPerBankAccount payTM_number phonePe_number upiId watchlistInstruments isAlgoTrader contests portfolio referrals subscription internshipBatch')
    const token = await newuser.generateAuthToken();

    // console.log("Token:",token)

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
    });

    // console.log("res:",res)
    res.status(201).json({ status: "Success", data: populatedUser, message: "Welcome! Your account is created, please login with your credentials.", token: token });

    // now inserting userId in free portfolio's
    // const idOfUser = newuser._id;


    if (!newuser) return res.status(400).json({ status: 'error', message: 'Something went wrong' });

    // res.status(201).json({status: "Success", data:newuser, token: token, message:"Welcome! Your account is created, please check your email for your userid and password details."});
    // let email = newuser.email;
    let subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
    let message =
      `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Account Created</title>
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

            .userid {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }

            .password {
                display: inline-block;
                background-color: #f5f5f5;
                padding: 10px;
                font-size: 15px;
                font-weight: bold;
                border-radius: 5px;
                margin-right: 10px;
            }

            .login-button {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
            }

            .login-button:hover {
                background-color: #0069d9;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Account Created</h1>
            <p>Dear ${newuser.first_name} ${newuser.last_name},</p>
            <p>Welcome to the StoxHero family!</p>
            
            <p>Discover Stock Market success with our Paper Trading &amp; Learning App. Experience real market data, actionable insights, and a clutter-free interface on both our mobile app and web platform.</p>
            
            <p>What StoxHero offers:</p>
            
            <ol>
                <li><strong>Learning Content:</strong> Enhance your market understanding.</li>
                <li><strong>Real Data Trading:</strong> Practice with virtual currency and real-world data.</li>
                <li><strong>Actionable Insights:</strong> Understand your trading style with valuable analytics.</li>
                <li><strong>User-Friendly Interface:</strong> Navigate seamlessly for an optimal trading experience.</li>
                <li><strong>Rewards for Success:</strong> Earn rewards for your winning trades.</li>
            </ol>
            
            <p>StoxHero is your all-in-one package for Stock Market success.</p>
            
            <p>In case you face any issues, feel free to whatsApp support at 9354010914<a href="tel:+919830994402" rel="noreferrer" target="_blank">&nbsp;</a>or drop in an email at <a href="mailto:team@stoxhero.com">team@stoxhero.com</a></p>
            
            <p>To get started, visit our youtube channel to learn more about the App and StoxHero: <a href="https://www.youtube.com/channel/UCgslF4zuDhDyttD9P3ZOHbg">Visit</a></p>
            
            <p>Happy Trading!</p>
            
            <p>Best,&nbsp;</p>
            
            <p>StoxHero Team</p>
            
            <p>&nbsp;</p>
            
            <hr />
            <h4 style="text-align:center"><strong>DOWNLOAD OUR APP FOR BETTER EXPERIENCE</strong></h4>
            
            <p>&nbsp;</p>
            
            <p style="text-align:center">
            <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app">
            <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463874playStore.png" style="height:100px; width:250px" />
            </a>&nbsp;&nbsp;
            <a href="http://www.stoxhero.com">
            <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463880logoWeb.png" style="height:100px; width:250px" />
            </a>
            </p>
            
            <p>&nbsp;</p>
          </body>
        </html>

    `
    if (process.env.PROD == 'true') {
      await emailService(newuser.email, subject, message);
    }

    if (process.env.PROD == 'true') {
      await whatsAppService.sendWhatsApp({ destination: newuser.mobile, campaignName: 'direct_signup_campaign_new', userName: newuser.first_name, source: newuser.creationProcess, media: { url: mediaURL, filename: mediaFileName }, templateParams: [newuser.first_name], tags: '', attributes: '' });
    }
    else {
      whatsAppService.sendWhatsApp({ destination: '9319671094', campaignName: 'direct_signup_campaign_new', userName: newuser.first_name, source: newuser.creationProcess, media: { url: mediaURL, filename: mediaFileName }, templateParams: [newuser.first_name], tags: '', attributes: '' });
      whatsAppService.sendWhatsApp({ destination: '8076284368', campaignName: 'direct_signup_campaign_new', userName: newuser.first_name, source: newuser.creationProcess, media: { url: mediaURL, filename: mediaFileName }, templateParams: [newuser.first_name], tags: '', attributes: '' });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Something wenr wrong', error: error.message })
  }
};

//get deactivated user
exports.getdeactivateUser = async (req, res) => {
  try {

    const user = await DeactivateUser.find()
    .populate("deactivatedUser", 'first_name last_name')
    .select('deactivatedUser email mobile createdOn')
    .sort({createdOn: -1})

    res.status(201).json({
      status: 'success',
      message: "user deactivated successfully",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: "Something went wrong",
      error: error.message
    });
  }
};

//get user

exports.getUsers = async (req, res) => {
  const searchString = req.query.search;
  try {
      const data = await UserDetail.find({
          $and: [
              {
                  $or: [
                      { email: { $regex: searchString, $options: 'i' } },
                      { first_name: { $regex: searchString, $options: 'i' } },
                      { last_name: { $regex: searchString, $options: 'i' } },
                      { mobile: { $regex: searchString, $options: 'i' } },
                  ]
              },
              {
                  status: 'Active',
              },
          ]
      }).select('first_name last_name email mobile _id myReferralCode')
      res.status(200).json({
          status: "success",
          message: "Getting User successfully",
          data: data
      });
  } catch (error) {
      res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error: error.message
      });
  }
};

exports.editUser = async (req, res, next) => {
  // console.log(req.body)
  try {
    const user = await UserDetail.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'No such user found.' });

    const filteredBody = filterObj(req.body, 'status', 'uId', 'createdOn', 'lastModified', 'createdBy', 'name',
      'first_name', 'last_name', 'cohort', 'designation', 'email', 'maritalStatus', 'currentlyWorking',
      'previouslyEmployeed', 'latestSalaryPerMonth', 'familyIncomePerMonth', 'collegeName', 'stayingWith',
      'nonWorkingDurationInMonths', 'mobile', 'mobile_otp', 'whatsApp_number', 'degree', 'dob', 'gender',
      'address', 'trading_exp', 'location', 'city', 'state', 'country', 'last_occupation', 'family_yearly_income',
      'joining_date', 'purpose_of_joining', 'employeed', 'role', 'creationProcess', 'employeeid', 'pincode', 'upiId',
      'googlePay_number', 'payTM_number', 'phonePe_number', 'bankName', 'nameAsPerBankAccount', 'accountNumber', 'ifscCode',
      'password', 'resetPasswordOTP', 'resetPasswordExpires', 'passwordChangedAt', 'userId', 'fund', 'aadhaarNumber',
      'panNumber', 'drivingLicenseNumber', 'passportNumber', 'KYCStatus', 'myReferralCode', 'referrerCode',
      'referredBy', 'campaignCode', 'campaign', 'contests', 'portfolio', 'isAlgoTrader'
    );

    filteredBody.lastModifiedBy = req.user._id;
    // console.log("Profile Photo Url: ",req.profilePhotoUrl)
    // if((req).profilePhotoUrl) filteredBody.profilePhoto = (req).profilePhotoUrl;
    // if((req).aadhaarCardFrontImageUrl) filteredBody.aadhaarCardFrontImage = (req).aadhaarCardFrontImageUrl;
    // if((req).aadhaarCardBackImageUrl) filteredBody.aadhaarCardBackImage = (req).aadhaarCardBackImageUrl;
    // if((req).panCardFrontImageUrl) filteredBody.panCardFrontImage = (req).panCardFrontImageUrl;
    // if((req).passportPhotoUrl) filteredBody.passportPhoto = (req).passportPhotoUrl;

    if (req.profilePhotoUrl) {
      if (!filteredBody.profilePhoto) {
        filteredBody.profilePhoto = {};
      }
      filteredBody.profilePhoto.url = req.profilePhotoUrl;
      filteredBody.profilePhoto.name = (req.files).profilePhoto[0].originalname;
    }

    if (req.aadhaarCardFrontImageUrl) {
      if (!filteredBody.aadhaarCardFrontImage) {
        filteredBody.aadhaarCardFrontImage = {};
      }
      filteredBody.aadhaarCardFrontImage.url = req.aadhaarCardFrontImageUrl;
      filteredBody.aadhaarCardFrontImage.name = (req.files).aadhaarCardFrontImage[0].originalname;
    }

    if (req.aadhaarCardBackImageUrl) {
      if (!filteredBody.aadhaarCardBackImage) {
        filteredBody.aadhaarCardBackImage = {};
      }
      filteredBody.aadhaarCardBackImage.url = req.aadhaarCardBackImageUrl;
      filteredBody.aadhaarCardBackImage.name = (req.files).aadhaarCardBackImage[0].originalname;
    }

    if (req.panCardFrontImageUrl) {
      if (!filteredBody.panCardFrontImage) {
        filteredBody.panCardFrontImage = {};
      }
      filteredBody.panCardFrontImage.url = req.panCardFrontImageUrl;
      filteredBody.panCardFrontImage.name = (req.files).panCardFrontImage[0].originalname;
    }

    if (req.passportPhotoUrl) {
      if (!filteredBody.passportPhoto) {
        filteredBody.passportPhoto = {};
      }
      filteredBody.passportPhoto.url = req.passportPhotoUrl;
      filteredBody.passportPhoto.name = (req.files).passportPhoto[0].originalname;
    }

    if (req.addressProofDocumentUrl) {
      if (!filteredBody.addressProofDocument) {
        filteredBody.addressProofDocument = {};
      }
      filteredBody.addressProofDocument.url = req.addressProofDocumentUrl;
      filteredBody.addressProofDocument.name = (req.files).addressProofDocument[0].originalname;
    }
    // if((req).addressProofDocumentUrl) filteredBody.addressProofDocument.name = (req.files).addressProofDocument[0].originalname;
    if ((req).incomeProofDocumentUrl) filteredBody.incomeProofDocument = (req).incomeProofDocumentUrl;
    // console.log(filteredBody)
    const userData = await UserDetail.findByIdAndUpdate(user._id, filteredBody, { new: true });
    // console.log(userData);

    res.status(200).json({ message: 'Edit successful', status: 'success', data: userData });

  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Something went wrong. Try again.'
    })
  }




}

exports.changePassword = async (req, res) => {
  try {
    // Check if user exists
    const user = await UserDetail.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if current password is correct
    const isPasswordCorrect = await user.correctPassword(req.body.currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update the password and save the user
    user.password = req.body.newPassword;
    user.passwordChangedAt = new Date();
    const updatedUser = await user.save({ validateBeforeSave: false });

    // Generate a new JWT token for the user
    const token = await updatedUser.generateAuthToken();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token: token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'An error occurred while changing password'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Check if user exists
    const user = await UserDetail.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }


    // Update the password and save the user
    user.password = req.body.newPassword;
    user.passwordChangedAt = new Date();
    const updatedUser = await user.save({ validateBeforeSave: false });

    // Generate a new JWT token for the user
    const token = await updatedUser.generateAuthToken();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token: token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'An error occurred while changing password'
    });
  }
};

exports.signupusersdata = async (req, res, next) => {
  // console.log("Inside overall virtual pnl")
  let now = new Date();
  now.setUTCHours(0, 0, 0, 0); // set the time to start of day in UTC
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  yesterdayDate.setUTCHours(0, 0, 0, 0)
  let eodDate = new Date();
  eodDate.setUTCHours(23, 59, 59, 999)
  // console.log("Yesterday Date:",yesterdayDate,now)

  let startOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  let startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0));
  let endOfLastMonth = new Date(startOfThisMonth - 1);
  // console.log("Dates:",startOfThisMonth,startOfLastMonth,endOfLastMonth)

  let startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getUTCDate() - now.getUTCDay());
  startOfThisWeek.setUTCHours(0, 0, 0, 0);

  let startOfLastWeek = new Date(startOfThisWeek - 7 * 24 * 60 * 60 * 1000);
  let endOfLastWeek = new Date(startOfThisWeek - 1);
  // console.log("Week Dates:",startOfThisWeek,startOfLastWeek,endOfLastWeek)

  let startOfThisYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
  let startOfLastYear = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1, 0, 0, 0, 0));
  let endOfLastYear = new Date(startOfThisYear - 1);
  // console.log("Year Dates:",startOfThisYear,startOfLastYear,endOfLastYear)


  const pipeline = [
    {
      $facet: {
        "todayUsers": [
          {
            $match: {
              joining_date: {
                $gte: now,
                // $lt: now
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          },
          {
            $unwind: "$count"
          },
        ],
        "yesterdayUsers": [
          {
            $match: {
              joining_date: {
                $gte: yesterdayDate,
                $lt: now
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "thisWeekUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfThisWeek,
                $lt: eodDate
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "lastWeekUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfLastWeek,
                $lt: endOfLastWeek
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "thisMonthUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfThisMonth,
                $lt: eodDate
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "lastMonthUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfLastMonth,
                $lt: endOfLastMonth
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "thisYearUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfThisYear,
                $lt: eodDate
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "lifetimeUsers": [
          {
            $match: {
              joining_date: {
                // $gte: startOfLastMonth,
                $lt: eodDate
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ],
        "lastYearUsers": [
          {
            $match: {
              joining_date: {
                $gte: startOfLastYear,
                $lt: endOfLastYear
              }
            }
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1,
            }
          }
        ]
      }
    }
  ]

  const signupusers = await UserDetail.aggregate(pipeline)
  res.status(201).json({ message: "Users Recieved", data: signupusers });
}

exports.getFilteredUsers = async(req,res,next) =>{
  try {
    // Start with an empty query object
    let query = {};

    let { startDate, endDate, referral, campaign, referredBy } = req.query;
    console.log('Query', new Date(startDate), new Date(endDate), referral, campaign, referredBy);

    // If startDate and endDate are provided, add a range query for joiningDate
    if(!startDate) startDate = new Date('2022-01-01');
    if(!endDate) endDate = new Date();
    if (startDate && endDate) {
        query.joining_date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    // If referral is provided, add it to the query
    if (referral) {
        query.referralProgramme = mongoose.Types.ObjectId(referral);
    }

    // If campaign is provided, add it to the query
    if (campaign) {
        query.campaign = mongoose.Types.ObjectId(campaign);
    }

    if(referredBy && referredBy.toString()!='undefined'){
      query.referredBy = mongoose.Types.ObjectId(referredBy);
    }

    // Execute the search using the constructed query
    const users = await UserDetail.find(query).populate('campaign', 'campaignName').
                  populate('referredBy', 'first_name last_name').
                  select('first_name last_name email mobile joining_date referredBy campaign creationProcess');
    console.log('filtered users', users);

    // Return the results
    res.status(200).json({
        status:'success',
        data: users
    });

  } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({
          status:error,
          message: "Something went wrong"
      });
  }
}

exports.understoodGst = async(req,res,next) =>{
  try{
    const user = await UserDetail.findByIdAndUpdate(req.user._id, {gstAgreement:true});
    res.status(200).json({status:'success', message:'User understood GST Regulations'});
  }catch(e){
    console.log(e);
    res.status(500).json({status:'error', message:'Something went wrong'});
  }
}

exports.getReferralsBetweenDates = async (req, res, next) => {
  // console.log("Inside overall virtual pnl")
  let {startDate, endDate, mobile} = req.params;
  startDate = new Date(startDate);
  endDate = new Date(endDate)
  endDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(18, 59, 59, 999); // set the time to start of day in UTC
  console.log(startDate,endDate)

  const pipeline = [
    {
      $project: {
        _id: 0,
        mobile: 1,
        referrals: 1,
      },
    },
    {
      $match: {
        mobile: mobile,
      },
    },
    {
      $unwind: {
        path: "$referrals",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "referrals.referredUserId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        mobile: 1,
        referral_date: {
          $add: [
            {
              $toDate: {
                $arrayElemAt: [
                  "$user.joining_date",
                  0,
                ],
              },
            },
            5 * 60 * 60 * 1000,
            // Add 5 hours (5 * 60 * 60 * 1000 milliseconds)
            30 * 60 * 1000, // Add 30 minutes (30 * 60 * 1000 milliseconds)
          ],
        },
      },
    },
    {
      $match: {
        referral_date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
  ]
 
  const referrals = await UserDetail.aggregate(pipeline)
  console.log("Referrals",referrals.length)
  res.status(201).json({ message: "Referrals Recieved", data: referrals.length });
}

exports.checkUserExist = async(req, res)=>{
  const {mobile} = req.params;
  const findUser = await UserDetail.findOne({mobile: mobile});
  res.status(201).json({ status: "success", data: findUser ? true : false});
}

exports.addAddress = async(req, res)=>{
  try{
    const {latitude, longitude, address, house_or_flat_no, floor,
      pincode, city, state, country, tag, locality, landmark, contact_name, contact_number} = req.body;
    
    const address_details = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      country: country,
      tag, locality, landmark,
      house_or_flat_no, floor,
      contact_name, contact_number
    };
  
    const updateAddress = await UserDetail.findOneAndUpdate({_id: new ObjectId(req.user._id)}, {
      $push: {
        address_details: address_details
      }
    }, {new : true}).select('address_details');
    ApiResponse.success(res, updateAddress);
  
  } catch(error){
    ApiResponse.error(res, 'Something went wrong', 500, error.message);
  }
}

exports.removeAddress = async(req, res)=>{
  try{
    const {id} = req.params;

    const updateAddress = await UserDetail.findOneAndUpdate({_id: new ObjectId(req.user._id)}, {
      $pull: {
        address_details: { _id: new ObjectId(id) }
      }
    }, {new: true}).select('address_details');
  
    ApiResponse.success(res, updateAddress);  
  } catch(error){
    ApiResponse.error(res, 'Something went wrong', 500, error.message);
  }
}

exports.editAddress = async (req, res) => {
  try {
    const { id } = req.params;
    let address_details = {};
    const {latitude, longitude, address, house_or_flat_no, floor,
      pincode, city, state, country, tag, locality, landmark, contact_name, contact_number} = req.body;
    
    const userAddress = await UserDetail.findOne({ _id: new ObjectId(req.user._id) }).select('address_details');
    for (let elem of userAddress.address_details) {
      if (elem?._id?.toString() === id?.toString()) {
        const prevLatitude = elem.location.coordinates[0];
        const prevLongitude = elem.location.coordinates[1];

        address_details = {
          location: {
            type: "Point",
            coordinates: [latitude || prevLatitude, longitude || prevLongitude]
          },
          address: address || elem?.address,
          pincode: pincode || elem?.pincode,
          city: city || elem?.city,
          state: state || elem?.state,
          country: country || elem?.country,
          tag: tag || elem?.tag,
          landmark: landmark || elem?.landmark,
          locality: locality || elem?.locality,
          house_or_flat_no: house_or_flat_no || elem?.house_or_flat_no,
          floor: floor || elem?.floor,
          contact_name: contact_name || elem?.contact_name,
          contact_number: contact_number || elem?.contact_number,
        };

        console.log("address_details", address_details);
        Object.assign(elem, address_details);

        // Save the changes
        await userAddress.save({ validateBeforeSave: false, new: true });

        ApiResponse.success(res, userAddress);
        return;
      }
    }
  } catch (error) {
    ApiResponse.error(res, 'Something went wrong', 500, error.message);
  }
}

exports.getAddress = async (req, res) => {
  try {
    
    const userAddress = await UserDetail.findOne({ _id: new ObjectId(req.user._id) }).select('address_details');
    ApiResponse.success(res, userAddress);

  } catch (error) {
    ApiResponse.error(res, 'Something went wrong', 500, error.message);
  }
}

exports.saveCurrentLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userLocation = await UserDetail.findOneAndUpdate({ _id: new ObjectId(req.user._id) }, {
      $set: {
        current_location: {
          latitude: latitude,
          longitude: longitude
        }
      }
    }, {new: true}).select('current_location');

    ApiResponse.success(res, userLocation); 
  } catch (error) {
    console.log(error)
    ApiResponse.error(res, 'Something went wrong', 500, error.message);
  }
}