const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const { ObjectId } = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");
const User = require("../../models/User/userSchema");
const Payment = require("../../models/Payment/payment");
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const {sendMultiNotifications} = require('../../utils/fcmService');




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
        const booking = await Booking.find({ status: "Pending" })
            .sort({ booking_date: 1 })
            .populate('product_id', 'product_name')
            .populate('pandits', 'pandit_name mobile experience_in_year')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllApproved = async (req, res) => {
    try {
        const booking = await Booking.find({ status: "Approved" })
            .sort({ booking_date: 1 })
            .populate('product_id', 'product_name')
            .populate('pandits', 'pandit_name mobile experience_in_year')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllConfirmed = async (req, res) => {
    try {
        const booking = await Booking.find({ status: "Confirmed" })
            .sort({ booking_date: 1 })
            .populate('product_id', 'product_name')
            .populate('pandits', 'pandit_name mobile experience_in_year')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllCompleted = async (req, res) => {
    try {
        const booking = await Booking.find({ status: "Completed" })
            .sort({ booking_date: 1 })
            .populate('product_id', 'product_name')
            .populate('pandits', 'pandit_name mobile experience_in_year')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.getAllRejected = async (req, res) => {
    try {
        const booking = await Booking.find({ status: "Rejected" })
            .sort({ booking_date: 1 })
            .populate('product_id', 'product_name')
            .populate('pandits', 'pandit_name mobile experience_in_year')
            .populate('payment_details', 'transaction_id payment_status payment_mode')
            .populate('user_id', 'full_name mobile')
            .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
            .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.approveBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Approved"
            }
        })

        const user = await User.findById(booking.user_id);
        if (user?.fcm_tokens?.length > 0) {
            await sendMultiNotifications('Booking Approved',
              `Your booking has been approved by Punyam. Stay tuned.`,
              user?.fcm_tokens?.map(item => item.token), null, { route: 'pooja' }
            )
          }
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.rejectBooking = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    try {
        const booking = await Booking.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                reject_message: rejectionReason,
                status: "Rejected"
            }
        })

        const user = await User.findById(booking.user_id);
        if (user?.fcm_tokens?.length > 0) {
            await sendMultiNotifications('Booking Rejected',
                `Your booking has been rejected by Punyam due to ${rejectionReason}.`,
                user?.fcm_tokens?.map(item => item.token), null, { route: 'pooja' }
            )
        }
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

exports.confirmBooking = async (req, res) => {
    const { id } = req.params;
    const { booking_date, pandits } = req.body;
    try {
        const booking = await Booking.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Confirmed",
                booking_date: booking_date,
                pandits: pandits
            }
        })

        const user = await User.findById(booking.user_id);
        const date = convertTime(booking_date);
        if (user?.fcm_tokens?.length > 0) {
            await sendMultiNotifications('Pooja Confirmed',
                `Your pooja booking has been confirmed by pandit ji on ${date}. He will arrive on time, so please be prepared for the pooja.`,
                user?.fcm_tokens?.map(item => item.token), null, { route: 'pooja' }
            )
        }
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

function convertTime(date) {
    const inputDateString = date;
    const inputDate = new Date(inputDateString);

    // Format date
    const day = inputDate.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
    const hours = inputDate.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = inputDate.getMinutes();
    const ampm = inputDate.getHours() >= 12 ? 'PM' : 'AM';

    const formattedDate = `${day} ${month} ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return (formattedDate);
}

exports.completeBooking = async (req, res) => {
    const { id } = req.params;
    const { external_transaction_id, payment_throw, payment_mode, payment_status, paymentId } = req.body;
    try {
        const payment = await Payment.findOneAndUpdate({ _id: new ObjectId(paymentId) }, {
            $set: {
                external_transaction_id, payment_throw, payment_mode, payment_status,
                transaction_document: req.uploadUrl
            }
        })

        const booking = await Booking.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                status: "Completed",
                transaction_date: new Date,
            }
        })

        // const user = await User.findById(booking.user_id);
        // if (user?.fcm_tokens?.length > 0) {
        //     await sendMultiNotifications('Pooja completed',
        //         `Your pooja booking has been confirmed by Pandit Ji. He will arrive on time, so please be prepared for the pooja.`,
        //         user?.fcm_tokens?.map(item => item.token), null, { route: 'pooja' }
        //     )
        // }
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};