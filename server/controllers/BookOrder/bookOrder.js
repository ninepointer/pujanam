const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Order = require("../../models/Book-Order/orderSchema");
const Payment = require("../../models/Payment/payment");
const mongoose = require('mongoose');
const User = require("../../models/User/userSchema")

exports.order = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            latitude, longitude, address, pincode, city, state, country,
            mobile, order_amount, category_id, item_id,
            tag, order_quantity,
            landmark,
            locality,
            house_or_flat_no,
            floor
        } = req.body;

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
            tag,
            landmark,
            locality,
            house_or_flat_no,
            floor,
        }

        const payment = await Payment.create([{
            transaction_id: generateUniqueTransactionId(), payment_status: "UnPaid", payment_mode: "PAP", created_by: req.user._id
        }], { session });

        const createOrder = await Order.create([{
            user_id: req.user._id, order_date: new Date() , address_details, mobile,
            order_amount, category_id, item_id, order_quantity,
            created_by: req.user._id, payment_details: payment[0]._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        ApiResponse.success(res, createOrder);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.myOrder = async (req, res) => {
    
    try {
        const booking = await Order.findOne({user_id: new ObjectId(req.user._id)})
        .populate('payment_details', 'transaction_id payment_status payment_mode')
        .populate('category_id', 'name')
        .populate('item_id', 'name')
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

function generateUniqueTransactionId() {
    const maxLength = 36;
    const allowedCharacters = "0123456789";

    const timestampPart = "MTID" + Date.now().toString();
    const remainingLength = maxLength - timestampPart.length;
    const randomChars = Array.from({ length: 5 }, () => allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)]).join('');

    return timestampPart + randomChars;
}