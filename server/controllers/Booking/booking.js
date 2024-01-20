const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");

exports.getAllPending = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Pending"})
        .sort({booking_date: 1})
        .populate('product', 'product_name')
        .populate('pandit', 'pandit_name mobile experience_in_year')
        .populate('payment', 'transaction_id payment_status payment_mode')
        .populate('user', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllApproved = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Approved"})
        .sort({booking_date: 1})
        .populate('product', 'product_name')
        .populate('pandit', 'pandit_name mobile experience_in_year')
        .populate('payment', 'transaction_id payment_status payment_mode')
        .populate('user', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllConfirmed = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Confirmed"})
        .sort({booking_date: 1})
        .populate('product', 'product_name')
        .populate('pandit', 'pandit_name mobile experience_in_year')
        .populate('payment', 'transaction_id payment_status payment_mode')
        .populate('user', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllCompleted = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Completed"})
        .sort({booking_date: 1})
        .populate('product', 'product_name')
        .populate('pandit', 'pandit_name mobile experience_in_year')
        .populate('payment', 'transaction_id payment_status payment_mode')
        .populate('user', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getAllRejected = async (req, res) => {
    try {
        const booking = await Booking.find({status: "Rejected"})
        .sort({booking_date: 1})
        .populate('product', 'product_name')
        .populate('pandit', 'pandit_name mobile experience_in_year')
        .populate('payment', 'transaction_id payment_status payment_mode')
        .populate('user', 'full_name mobile')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};