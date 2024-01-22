const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Order = require("../../models/Book-Order/orderSchema");
const Payment = require("../../models/Payment/payment");
const mongoose = require('mongoose');
const User = require("../../models/User/userSchema")

const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();



const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
}

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const upload = multer({ storage, fileFilter }).single("transactionDocument");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    sharp(req.file.buffer).resize({ width: 500, height: 500 }).toBuffer()
        .then((resizedImageBuffer) => {
            req.file.buffer = resizedImageBuffer;
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error resizing photo" });
        });
};

exports.uploadToS3 = async (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }

    // create S3 upload parameters
    const key = `withdrawals/documents/${(Date.now()) + req.file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
    };

    // upload image to S3 bucket

    s3.upload((params)).promise()
        .then((s3Data) => {
            (req).uploadUrl = s3Data.Location;
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error uploading to S3" });
        });
};


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