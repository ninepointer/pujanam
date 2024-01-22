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
            tag, item_details,
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
            // order_amount, category_id, item_id, order_quantity,
            item_details,
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
        const booking = await Order.find({user_id: new ObjectId(req.user._id)})
        .populate('payment_details', 'transaction_id payment_status payment_mode')
        .populate('item_details.category_id', 'name')
        .populate('item_details.item_id', 'name image min_order_quantity unit')
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


exports.getAllPending = async (req, res) => {
    try {
        const booking = await Order.find({ status: "Pending" })
            .sort({ order_date: 1 })
            .populate('item_details.category_id', 'name')
            .populate('item_details.item_id', 'name')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllAccept = async (req, res) => {
    try {
        const booking = await Order.find({ status: "Accepted" })
            .sort({ order_date: 1 })
            .sort({ order_date: 1 })
            .populate('item_details.category_id', 'name')
            .populate('item_details.item_id', 'name')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllDispatched = async (req, res) => {
    try {
        const booking = await Order.find({ status: "Dispatched" })
            .sort({ order_date: 1 })
            .sort({ order_date: 1 })
            .populate('item_details.category_id', 'name')
            .populate('item_details.item_id', 'name')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllDelivered = async (req, res) => {
    try {
        const booking = await Order.find({ status: "Delivered" })
            .sort({ order_date: 1 })
            .sort({ order_date: 1 })
            .populate('item_details.category_id', 'name')
            .populate('item_details.item_id', 'name')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllRejected = async (req, res) => {
    try {
        const booking = await Order.find({ status: "Rejected" })
            .sort({ order_date: 1 })
            .sort({ order_date: 1 })
            .populate('item_details.category_id', 'name')
            .populate('item_details.item_id', 'name')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.editOrderItem = async (req, res) => {
    const { id } = req.params;
    const {item_id, quantity} = req.query;
    try {
        const filter = {
            "_id": new ObjectId(id),
            "item_details._id": new ObjectId(item_id)
        };

        // Specify the update operation
        const update = {
            $set: {
                "item_details.$.order_quantity": Math.abs(Number(quantity))
            }
        };

        // Set the options to return the modified document
        const options = {
            new: true
        };

        const order = await Order.findOneAndUpdate(filter, update, options).select('item_details')

        ApiResponse.success(res, order);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.removeItem = async (req, res) => {
    const { id } = req.params;
    const {item_id} = req.query;
    try {
        const filter = {
            "_id": new ObjectId(id),
            "item_details._id": new ObjectId(item_id)
        };

        // Specify the update operation
        const update = {
            $pull: {
              "item_details": { "_id": new ObjectId(item_id) } // Replace with the actual _id of the item_details you want to remove
            }
          };

        // Set the options to return the modified document
        const options = {
            new: true
        };

        const order = await Order.findOneAndUpdate(filter, update, options).select('item_details')

        ApiResponse.success(res, order);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.rejectOrder = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    try {
        const booking = await Order.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                reject_message: rejectionReason,
                status: "Rejected"
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.acceptOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Order.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Accepted"
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.dispatchOrder = async (req, res) => {
    const { id } = req.params;
    const { expected_dispatch_time } = req.body;
    try {
        const order = await Order.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Dispatched",
                expected_dispatch_time: expected_dispatch_time,
            }
        })
        ApiResponse.success(res, order);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.deliverOrder = async (req, res) => {
    const { id } = req.params;
    const { external_transaction_id, payment_throw, payment_mode, payment_status, paymentId } = req.body;
    try {
        const payment = await Payment.findOneAndUpdate({ _id: new ObjectId(paymentId) }, {
            $set: {
                external_transaction_id, payment_throw, payment_mode, payment_status,
                transaction_document: req.uploadUrl
            }
        })

        const order = await Order.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Delivered",
                transaction_date: new Date,
            }
        })
        ApiResponse.success(res, order);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};