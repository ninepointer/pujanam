// const { ObjectId } = require("mongodb");
// const Payment = require("../models/Payment/payment");
// const uuid = require("uuid")
// const User = require("../models/User/userSchema");
// const sendMail = require('../utils/emailService');
// const {sendMultiNotifications} = require('../utils/fcmService');
// const axios = require('axios');
// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const Setting = require('../models/settings/setting');
// const whatsAppService = require("../utils/whatsAppService")

// exports.createPayment = async(req, res, next)=>{
//     // console.log(req.body)
//     const{paymentTime, transactionId, amount, paymentBy, currency, 
//         paymentFor, paymentMode, paymentStatus } = req.body;

//     // const orderId = `SHSID${amount}${transactionId}`;
//     const user = await User.findOne({_id: new ObjectId(paymentBy)});
//     const session = await mongoose.startSession();
//     try{
//         if(await Payment.findOne({transactionId : transactionId })) return res.status(400).json({info:'This payment is already exists.'});
//           session.startTransaction();
//         const payment = await Payment.create([{paymentTime, transactionId, amount, paymentBy, currency, 
//             paymentFor, paymentMode, paymentStatus, createdBy: req.user._id, lastModifiedBy: req.user._id}], {session:session});
        
//         const wallet = await UserWallet.findOne({userId: new ObjectId(paymentBy)});
//         const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
//             return transaction.transactionType === "Cash";
//         });

//         const bonusTransactions = (wallet)?.transactions?.filter((transaction) => {
//             return transaction.transactionType === "Bonus";
//         });

//         const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
//             return total + transaction?.amount;
//         }, 0);

//         const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
//             return total + transaction?.amount;
//         }, 0);
//         wallet.transactions = [...wallet.transactions, {
//                 title: 'Amount Credit',
//                 description: `The amount that has been credited to your wallet.`,
//                 amount: (amount.toFixed(2)),
//                 transactionId: uuid.v4(),
//                 transactionType: 'Cash'
//         }];
//         await wallet.save({session});

//         if(process.env.PROD == 'true'){
//             sendMail(user?.email, 'Amount Credited - StoxHero', `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Amount Credited</title>
//                 <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     font-size: 16px;
//                     line-height: 1.5;
//                     margin: 0;
//                     padding: 0;
//                 }
      
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                     border: 1px solid #ccc;
//                 }
      
//                 h1 {
//                     font-size: 24px;
//                     margin-bottom: 20px;
//                 }
      
//                 p {
//                     margin: 0 0 20px;
//                 }
      
//                 .userid {
//                     display: inline-block;
//                     background-color: #f5f5f5;
//                     padding: 10px;
//                     font-size: 15px;
//                     font-weight: bold;
//                     border-radius: 5px;
//                     margin-right: 10px;
//                 }
      
//                 .password {
//                     display: inline-block;
//                     background-color: #f5f5f5;
//                     padding: 10px;
//                     font-size: 15px;
//                     font-weight: bold;
//                     border-radius: 5px;
//                     margin-right: 10px;
//                 }
      
//                 .login-button {
//                     display: inline-block;
//                     background-color: #007bff;
//                     color: #fff;
//                     padding: 10px 20px;
//                     font-size: 18px;
//                     font-weight: bold;
//                     text-decoration: none;
//                     border-radius: 5px;
//                 }
      
//                 .login-button:hover {
//                     background-color: #0069d9;
//                 }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                 <h1>Amount Credited</h1>
//                 <p>Hello ${user.first_name},</p>
//                 <p>Amount of ${amount}INR has been credited in you wallet</p>
//                 <p>You can now purchase Tenx and participate in contest.</p>
                
//                 <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
//                 <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
//                 <br/><br/>
//                 <p>Thanks,</p>
//                 <p>StoxHero Team</p>
      
//                 </div>
//             </body>
//             </html>
//             `);
//         }
//         await createUserNotification({
//             title:'Amount Credited in Your Wallet- Topup',
//             description:`₹${amount?.toFixed(2)} credited in your wallet as wallet top up`,
//             notificationType:'Individual',
//             notificationCategory:'Informational',
//             productCategory:'General',
//             user: user?._id,
//             priority:'Low',
//             channels:['App', 'Email'],
//             createdBy:'63ecbc570302e7cf0153370c',
//             lastModifiedBy:'63ecbc570302e7cf0153370c'  
//           }, session);
//           if(user?.fcmTokens?.length>0){
//             await sendMultiNotifications('Amount Credited in Your Wallet - Topup', 
//               `₹${amount?.toFixed(2)} credited in your wallet as wallet top up`,
//               user?.fcmTokens?.map(item=>item.token), null, {route:'wallet'}
//               )  
//           }
//           try{
//               if(process.env.PROD == 'true'){
//                 whatsAppService.sendWhatsApp({destination : user?.mobile, campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),(totalCashAmount+amount).toLocaleString('en-IN'), totalBonusAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
//                 whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),(totalCashAmount+amount).toLocaleString('en-IN'), totalBonusAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
//             }
//             else {
//             // whatsAppService.sendWhatsApp({destination : '7976671752', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),totalCashAmount.toLocaleString('en-IN'), totalBonusAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
//                 whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'), (totalCashAmount+amount).toLocaleString('en-IN'), totalBonusAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
//             }
//           }catch(e){
//             console.log(e);
//           }
//         await session.commitTransaction();  
//         res.status(201).json({message: 'Payment successfully.', data:payment, count:payment.length});
//     }catch(error){
//         console.log(error)
//         await session.abortTransaction();
//     }finally{
//         await session.endSession();
//     }
// }

// exports.getSuccessfulPayment = async(req, res, next)=>{
//     const skip = parseInt(req.query.skip) || 0;
//     const limit = parseInt(req.query.limit) || 10

//     const count = await Payment.countDocuments({$match : {paymentStatus : 'succeeded' }});
//     const payment = await Payment.find({ paymentStatus: 'succeeded' })
//         .select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency createdOn gatewayResponse')
//         .populate('paymentBy', 'first_name last_name email mobile')
//         .sort({ _id: -1 })
//         .skip(skip)
//         .limit(limit);
    
//     res.status(201).json({message: "successful payment retreived", data: payment, count: count});    
        
// };

// exports.getInitiatedPayment = async(req, res, next)=>{
//     const skip = parseInt(req.query.skip) || 0;
//     const limit = parseInt(req.query.limit) || 10

//     const count = await Payment.countDocuments({$match : {paymentStatus : 'initiated' }});
//     const payment = await Payment.find({ paymentStatus: 'initiated' })
//         .select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency createdOn gatewayResponse')
//         .populate('paymentBy', 'first_name last_name email mobile')
//         .sort({ _id: -1 })
//         .skip(skip)
//         .limit(limit);
    
//     res.status(201).json({message: "successful payment retreived", data: payment, count: count});    
        
// };

// exports.getFailedPayment = async(req, res, next)=>{
//     const skip = parseInt(req.query.skip) || 0;
//     const limit = parseInt(req.query.limit) || 10

//     const count = await Payment.countDocuments({$match : {paymentStatus : 'failed' }});
//     const payment = await Payment.find({ paymentStatus: 'failed' })
//         .select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency createdOn gatewayResponse')
//         .populate('paymentBy', 'first_name last_name email mobile')
//         .sort({ _id: -1 })
//         .skip(skip)
//         .limit(limit);
    
//     res.status(201).json({message: "successful payment retreived", data: payment, count: count});    
        
// };

// exports.getPayment = async(req, res, next)=>{
//     const skip = parseInt(req.query.skip) || 0;
//     const limit = parseInt(req.query.limit) || 10

//     const count = await Payment.countDocuments();
//     const payment = await Payment.find().select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency createdOn')
//     .populate('paymentBy', 'first_name last_name email mobile')
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit);
    
//     res.status(201).json({message: "payment retreived", data: payment, count: count});    
        
// };
 
// exports.getUserPayment = async(req, res, next)=>{
    
//     const id = req.params.id
//     try{
//         const userPayment = await Payment.findOne({userId: id}).select('_id paymentTime transactionId amount paymentBy paymentMode paymentStatus currency')
//         res.status(201).json({message: "userPayment Retrived",data: userPayment});    
//     }
//     catch{(err)=>{res.status(401).json({message: "err userPayment", error:err}); }}  
// };

// // Controller for getting users
// exports.getUsers = async (req, res) => {
//     const searchString = req.query.search;
//     try {
//         const data = await User.find({
//             $and: [
//                 {
//                     $or: [
//                         { email: { $regex: searchString, $options: 'i' } },
//                         { first_name: { $regex: searchString, $options: 'i' } },
//                         { last_name: { $regex: searchString, $options: 'i' } },
//                         { mobile: { $regex: searchString, $options: 'i' } },
//                     ]
//                 },
//                 {
//                     status: 'Active',
//                 },
//             ]
//         })
//         res.status(200).json({
//             status: "success",
//             message: "Getting User successfully",
//             data: data
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };

// exports.initiatePayment = async (req, res) => {
//     const {
//         amount,
//         redirectTo,
//         productId,
//         paymentFor,
//         coupon,
//         bonusRedemption
//     } = req.body;
//     console.log('all body params',amount,
//         redirectTo,
//         productId,
//         paymentFor, coupon, bonusRedemption);
//     const setting = await Setting.find();
//     let merchantId = process.env.PROD=='true' ? process.env.PHONEPE_MERCHANTID : process.env.PHONEPE_MERCHANTID_STAGING  ;
//     let merchantTransactionId = generateUniqueTransactionId();
//     let merchantUserId = 'MUID'+ req.user._id;
//     let redirectUrl = process.env.PROD == 'true'? `https://stoxhero.com/paymenttest/status?merchantTransactionId=${merchantTransactionId}&redirectTo=${redirectTo}` : `http://43.204.7.180/paymenttest/status?merchantTransactionId=${merchantTransactionId}&redirectTo=${redirectTo}`;
//     let callbackUrl = process.env.PROD == 'true'? 'https://stoxhero.com/api/v1/payment/callback':'http://43.204.7.180/api/v1/payment/callback' ;
//     let redirectMode = 'REDIRECT'
//     const payment = await Payment.create({
//         paymentTime: new Date(),
//         currency: 'INR',
//         amount: amount/100,
//         gstAmount:((amount/100) - ((amount/100)/(1+(setting[0]?.gstPercentage==0?0:setting[0]?.gstPercentage/100)))), 
//         paymentStatus: 'initiated',
//         actions:[{
//             actionTitle: 'Payment Initiated',
//             actionDate: new Date(),
//             actionBy:req.user._id
//         }],
//         paymentBy:req.user?._id,
//         paymentFor,
//         productId,
//         coupon,
//         merchantTransactionId,
//         createdOn: new Date(),
//         createdBy: req.user._id,
//         modifiedOn: new Date(),
//         modifiedBy: req.user._id,
//         bonusRedemption: bonusRedemption
//     });

//     const paymentInstrument = {
//         type: "PAY_PAGE"
//     };

//     const payload = {
//         merchantId,
//         merchantTransactionId,
//         amount: amount,
//         merchantUserId,
//         redirectUrl,
//         redirectMode,
//         callbackUrl,
//         paymentInstrument
//     };

//     const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
//     const saltKey = process.env.PROD=='true' ? process.env.PHONEPE_KEY : process.env.PHONEPE_KEY_STAGING ; // This should be stored securely, not hardcoded
//     const saltIndex = '1';
//     const toHash = `${encodedPayload}/pg/v1/pay${saltKey}`;
    
//     const checksum = crypto.createHash('sha256').update(toHash).digest('hex') + '###' + saltIndex;

//     try {
//         const payUrl = process.env.PROD=='true'? 'https://api.phonepe.com/apis/hermes/pg/v1/pay':'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
//         const response = await axios.post(payUrl, {
//             request: encodedPayload
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum
//             }
//         });
//         // console.log(response);
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error initiating payment:', error);
//         res.status(500).json({status:'Error', message:'Something went wrong'});
//     }

// }

// function generateUniqueTransactionId() {
//     const maxLength = 36;
//     const allowedCharacters = "0123456789";
  
//     const timestampPart = "mtid" + Date.now().toString();
//     const remainingLength = maxLength - timestampPart.length;
//     const randomChars = Array.from({ length: 5 }, () => allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)]).join('');
  
//     return timestampPart + randomChars;
//   }

// exports.handleCallback = async (req, res, next) => {
//     console.log('phonepe--------callback------------');
//     try {
//         // Extract and decode the response
//         const encodedResponse = req.body.response;
//         const decodedString = Buffer.from(encodedResponse, 'base64').toString('utf8');
//         const decodedResponse = JSON.parse(decodedString);
//         // console.log('decoded response', decodedResponse);
//         const payment = await Payment.findOne({merchantTransactionId: decodedResponse.data.merchantTransactionId});
//         payment.gatewayResponse = decodedResponse;

//         // Check if Server-to-Server response is received
//         if (!decodedResponse) {
//             console.log('no decoded response');
//             // Call PG Check Status API if S2S response is not received
//             // TODO: Implement call to PG Check Status API and handle its response

//         } else {
//             // Validate checksum
//             // if (!verifyChecksum(decodedResponse, req.headers['X-VERIFY'])) {
//             //     return res.status(400).json({ status:'error', message: 'Checksum validation failed' });
//             // }

//             // Validate amount
//             if (decodedResponse.data.amount !== payment.amount*100) {
//                 return res.status(400).json({ status:'error', message: 'Amount mismatch' });
//             }

//             // Update payment status based on 'code'
//             if (decodedResponse.code === 'PAYMENT_SUCCESS') {
//                 // TODO: Update the status in your database to 'SUCCESS'
//                 payment.paymentStatus = 'succeeded';
//                 payment.actions.push({
//                     actionTitle:'Payment Successful',
//                     actionDate: new Date(),
//                     actionBy: '63ecbc570302e7cf0153370c'
//                 });
//                 await addMoneyToWallet(payment.amount-payment?.gstAmount, payment?.paymentBy);
//                 if(payment?.paymentFor && payment?.productId){
//                     await participateUser(payment?.paymentFor, payment?.productId, payment?.paymentBy,payment?.amount, payment?.coupon, payment?.bonusRedemption);
//                 }    
//                 console.log('Payment Successful');
//                 await payment.save({validateBeforeSave: false});
//                 if(payment?.coupon){
//                     if(payment?.paymentFor){
//                         await saveSuccessfulCouponUse(payment?.paymentBy, payment?.coupon, payment?.paymentFor, payment?.productId);
//                     }else{
//                         await addCashback(payment?.amount-payment?.gstAmount, payment?.paymentBy, payout?.coupon);
//                         await saveSuccessfulCouponUse(payment?.paymentBy, payment?.coupon, 'Wallet');
//                     }
//                 }
//                 if(!payment?.paymentFor){
//                     await sendWhatsAppNotification(payment);
//                 }

//                 res.status(200).json({ status:'success', message: 'Payment was successful' });
//             } else if (decodedResponse.code === 'PAYMENT_ERROR') {
//                 // TODO: Update the status in your database to 'FAILED'
//                 console.log('Failed payment');
//                 payment.paymentStatus = 'failed';
//                 payment.actions.push({
//                     actionTitle:'Payment Failed',
//                     actionDate: new Date(),
//                     actionBy: '63ecbc570302e7cf0153370c'
//                 });
//                 await payment.save({validateBeforeSave: false});
//                 res.status(200).json({ status:'success', message: 'Payment failed' });
//             } else {
//                 // Handle any other cases if needed
//                 payment.paymentStatus = 'processing';
//                 payment.actions.push({
//                     actionTitle:'Payment Processing',
//                     actionDate: new Date(),
//                     actionBy: '63ecbc570302e7cf0153370c'
//                 });
//                 await payment.save({validateBeforeSave: false});
//                 res.status(400).json({ status:'error', message: 'Unknown response code' });
//             }
//         }
//     } catch (error) {
//         console.error('Error handling callback:', error);
//         res.status(500).json({ status:'error', message: 'Internal server error' });
//     }
// }

// const SALT_KEY = process.env.PROD=='true' ? process.env.PHONEPE_KEY : process.env.PHONEPE_KEY_STAGING  ; // You may want to keep this in a secure environment variable or secret management tool.
// const SALT_INDEX = "1"; // This too could be managed securely if it's ever meant to change.

// const verifyChecksum = (encodedPayload, receivedChecksum) => {
//     const dataToHash = `${encodedPayload}/pg/v1/pay${SALT_KEY}`;
//     const calculatedChecksum = crypto.createHash('sha256').update(dataToHash).digest('hex');
//     const expectedChecksum = `${calculatedChecksum}###${SALT_INDEX}`;

//     return expectedChecksum === receivedChecksum;
// };

// exports.checkPaymentStatus = async(req,res, next) => {
//     try{
//         console.log('chekcing payment status-------------------------------------------------');
//         const {merchantTransactionId} = req.params;
//         const merchantId = process.env.PROD=='true' ? process.env.PHONEPE_MERCHANTID : process.env.PHONEPE_MERCHANTID_STAGING ;
//         const payment  = await Payment.findOne({merchantTransactionId});
//         // console.log('payment', payment);
//         const saltKey = process.env.PHONEPE_KEY; // This should be stored securely, not hardcoded
//         const saltIndex = '1';
//         const toHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}`+ saltKey;
//         const checksum = crypto.createHash('sha256').update(toHash).digest('hex') + '###' + saltIndex;
//         const checkStatusUrl = process.env.PROD=='true' ? `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`:`https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;
//         const resp = await axios.get(checkStatusUrl,{
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum,
//                 'X-MERCHANT-ID':merchantId
//             }
//         });
//         if(payment.paymentStatus == 'succeeded' || payment.paymentStatus == 'failed'){
//             return res.status(200).json({
//                 status:'success',
//                 message:'Payment status fetched',
//                 data:resp.data
//             });
//         }
//         console.log('response payment instrument', resp?.data?.data?.paymentInstrument);
//         if(resp.data.code == 'PAYMENT_SUCCESS'){
//             if(payment.paymentStatus != 'succeeded'){
//                 console.log('updating payment status');
//                 payment.paymentStatus = 'succeeded';
//                 payment.transactionId = resp?.data?.data?.transactionId;
//                 payment.paymentMode = resp?.data?.data?.paymentInstrument?.type;
//                     payment.actions.push({
//                         actionTitle:'Payment Successful',
//                         actionDate: new Date(),
//                         actionBy: '63ecbc570302e7cf0153370c'
//                     });
//                 console.log('amount hai', payment?.amount);    
//                 if(payment.amount == resp.data.data.amount/100){
//                     await addMoneyToWallet(payment.amount-payment?.gstAmount, payment?.paymentBy);
//                     if(payment?.paymentFor && payment?.productId){
//                         await participateUser(payment?.paymentFor, payment?.productId, payment?.paymentBy, payment?.amount, payment?.coupon);
//                     }
//                     //TODO:Remove this code
//                     if(payment?.coupon){
//                         if(payment?.paymentFor){
//                             // await saveSuccessfulCouponUse(payment?.paymentBy, payment?.coupon, payment?.paymentFor, payment?.productId);
//                         }else{
//                             await addCashback(payment?.amount-payment?.gstAmount, payment?.paymentBy, payment?.coupon);
//                             await saveSuccessfulCouponUse(payment?.paymentBy, payment?.coupon, 'Wallet');
//                         }
//                     }
//                     if(!payment?.paymentFor){
//                         await sendWhatsAppNotification(payment);
//                     }    
//                 }    
//             }
//         }else if(resp.data.code == 'PAYMENT_ERROR'){
//             if(payment.paymentStatus != 'failed'){
//                 payment.paymentStatus = 'failed';
//                 payment.transactionId = resp?.data?.data?.transactionId;
//                 payment.paymentMode = resp?.data?.data?.paymentInstrument?.type;
//                     payment.actions.push({
//                         actionTitle:'Payment Failed',
//                         actionDate: new Date(),
//                         actionBy: '63ecbc570302e7cf0153370c'
//                     });
//             }
//         }
//         await payment.save({validateBeforeSave:false});
    
//         res.status(200).json({
//             status:'success',
//             message:'Payment status fetched',
//             data:resp.data
//         });
//     }catch(e){
//         console.log(e);
//         res.status(500).json({status:'error', message:'Something went wrong.'});
//     }
// }

// const addMoneyToWallet = async (amount, userId) =>{
//     const wallet = await UserWallet.findOne({userId:userId});
//     wallet.transactions.push({
//         amount: amount,
//         title: 'Amount Credit',
//         description: `The amount that has been credited to your wallet.`,
//         transactionId: uuid.v4(),
//         transactionType: 'Cash'
//     });
//     await wallet.save({validateBeforeSave: false});
// }

// const addCashback = async(amount, userId, coupon) => {
//     const wallet = await UserWallet.findOne({userId:userId});
//     const couponDoc = await Coupon.findOne({code:coupon}).select('rewardType discountType discount maxDiscount');
//     if(couponDoc?.rewardType == 'Discount')return;
//     let cashbackAmount = 0;
//     if(couponDoc?.discountType == 'Flat'){
//         cashbackAmount = couponDoc?.discount;
//     }else{
//         cashbackAmount = Math.min(amount*couponDoc?.discount/100, couponDoc?.maxDiscount);
//     }
//     wallet.transactions.push({
//         title: 'StoxHero CashBack',
//         description: `Cashback of ${cashbackAmount?.toFixed(2)} HeroCash - code ${coupon} used`,
//         transactionDate: new Date(),
//         amount:cashbackAmount?.toFixed(2),
//         transactionId: uuid.v4(),
//         transactionType: 'Bonus'
//     });
//     await wallet.save({validateBeforeSave: false});

// }

// const sendWhatsAppNotification = async(payment) => {
//     const {paymentBy, amount, bonusRedemption} = payment;
//     const user = await User.findOne({_id: new ObjectId(paymentBy)}).select('first_name creationProcess last_name mobile fcmTokens');
//     if(user?.fcmTokens?.length>0){
//         await sendMultiNotifications('Amount Added To Wallet', 
//           `₹${amount?.toFixed(2)} credited in your wallet.`,
//           user?.fcmTokens?.map(item=>item.token), null, {route:'wallet'}
//           )  
//       }  

//     const wallet = await UserWallet.findOne({userId:new ObjectId(paymentBy)});
//     const cashTransactions = (wallet)?.transactions?.filter((transaction) => {
//         return transaction.transactionType === "Cash";
//     });

//     const bonusTransactions = (wallet)?.transactions?.filter((transaction) => {
//         return transaction.transactionType === "Bonus";
//     });

//     const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
//         return total + transaction?.amount;
//     }, 0);

//     const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
//         return total + transaction?.amount;
//     }, 0);

//     try{
//         if(process.env.PROD == 'true'){
//           whatsAppService.sendWhatsApp({destination : user?.mobile, campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),(totalCashAmount).toLocaleString('en-IN'), (totalBonusAmount).toLocaleString('en-IN')], tags : '', attributes : ''});
//           whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),(totalCashAmount).toLocaleString('en-IN'), (totalBonusAmount).toLocaleString('en-IN')], tags : '', attributes : ''});
//       }
//       else {
//       // whatsAppService.sendWhatsApp({destination : '7976671752', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'),totalCashAmount.toLocaleString('en-IN'), totalBonusAmount.toLocaleString('en-IN')], tags : '', attributes : ''});
//           whatsAppService.sendWhatsApp({destination : '8076284368', campaignName : 'wallet_credited_campaign', userName : user.first_name, source : user.creationProcess, templateParams : [user.first_name, amount.toLocaleString('en-IN'), (totalCashAmount).toLocaleString('en-IN'), (totalBonusAmount).toLocaleString('en-IN')], tags : '', attributes : ''});
//       }
//     }catch(e){
//       console.log(e);
//     }
// }

// const participateUser = async (paymentFor, productId, paymentBy, amount, coupon, bonusRedemption) => {
//     switch (paymentFor){
//         case 'Contest':
//             if(productId){
//                 const contest = await Contest.findById(productId).select('entryFee contestName');
//                 await handleSubscriptionDeduction(paymentBy, amount, contest?.contestName, contest?._id, coupon, bonusRedemption);
//             }
//             break;
//         case 'TenX':
//             if(productId){
//                 const tenx = await TenX.findById(productId).select('discounted_price plan_name');
//                 await handleDeductSubscriptionAmount(paymentBy, amount, tenx?.plan_name, tenx?._id, coupon, bonusRedemption);
//             }
//             break;
//         case 'TenX Renewal':
//             if(productId){
//                 const tenx = await TenX.findById(productId).select('discounted_price plan_name');
//                 await handleSubscriptionRenewal(paymentBy, amount, tenx?.plan_name, tenx?._id, coupon, bonusRedemption);
//             }
//             break;
//         case 'MarginX':
//             if(productId){
//                 const marginX = await MarginX.findById(productId).populate('marginXTemplate', 'entryFee');
//                 await handleDeductMarginXAmount(paymentBy, amount, marginX?.marginXName, marginX?._id, coupon, bonusRedemption);
//             }
//             break;
//         case 'Battle':
//             if(productId){
//                 const battle = await Battle.findById(productId).select('_id');
//                 await handleDeductBattleAmount(paymentBy, battle?._id);
//             }
//             break;
//         default:
//             break;
//     }
// }

// exports.makePayment = async(req, res) => {
//     const {
//         amount,
//         productId,
//         paymentFor,
//         coupon,
//         bonusRedemption,
//         merchantTransactionId
//     } = req.body;
//     try{
//         const setting = await Setting.find();
//         let merchantUserId = 'MUID'+ req.user._id;
//         const payment = await Payment.create({
//             paymentTime: new Date(),
//             currency: 'INR',
//             amount: amount/100,
//             gstAmount:((amount/100) - ((amount/100)/(1+(setting[0]?.gstPercentage==0?0:setting[0]?.gstPercentage/100)))), 
//             paymentStatus: 'initiated',
//             actions:[{
//                 actionTitle: 'Payment Initiated',
//                 actionDate: new Date(),
//                 actionBy:req.user._id
//             }],
//             paymentBy:req.user?._id,
//             paymentFor,
//             productId,
//             coupon,
//             merchantTransactionId,
//             createdOn: new Date(),
//             createdBy: req.user._id,
//             modifiedOn: new Date(),
//             modifiedBy: req.user._id,
//             bonusRedemption: bonusRedemption
//         });
//         res.status(200).json({status:'success', message:'Payment Initiated', data:payment});
//     }catch(e){
//         console.error('Error initiating payment:', error);
//         res.status(500).json({status:'Error', message:'Something went wrong'});
//     }
// }