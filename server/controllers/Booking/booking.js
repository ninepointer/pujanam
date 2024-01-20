const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");

exports.getAllPending = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Pending"})
        .sort({booking_date: 1})
        .populate('product_id', 'product_name')
        .populate('pandits', 'pandit_name mobile experience_in_year')
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('user_id', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllApproved = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Approved"})
        .sort({booking_date: 1})
        .populate('product_id', 'product_name')
        .populate('pandits', 'pandit_name mobile experience_in_year')
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('user_id', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllConfirmed = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Confirmed"})
        .sort({booking_date: 1})
        .populate('product_id', 'product_name')
        .populate('pandits', 'pandit_name mobile experience_in_year')
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('user_id', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllCompleted = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Completed"})
        .sort({booking_date: 1})
        .populate('product_id', 'product_name')
        .populate('pandits', 'pandit_name mobile experience_in_year')
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('user_id', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllRejected = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Rejected"})
        .sort({booking_date: 1})
        .populate('product_id', 'product_name')
        .populate('pandits', 'pandit_name mobile experience_in_year')
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('user_id', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.approveBooking = async (req, res) => {
    const {id} = req.params;
    try {
        const booking = await Booking.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                status: "Approved"
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.rejectBooking = async (req, res) => {
    const {id} = req.params;
    const {rejectionReason} = req.body;
    try {
        const booking = await Booking.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                reject_message: rejectionReason,
                status: "Rejected"
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.confirmBooking = async (req, res) => {
    const {id} = req.params;
    const {booking_date, pandits} = req.body;
    try {
        const booking = await Booking.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                status: "Confirmed",
                booking_date: booking_date,
                pandits: pandits
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.completeBooking = async (req, res) => {
    const {id} = req.params;
    const {booking_date, pandits, status} = req.body;
    try {
        const booking = await Booking.findOneAndUpdate({_id: new ObjectId(id)}, {
            $set: {
                status: "Confirmed",
                booking_date: booking_date,
                pandits: "pandits"
            }
        })
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};