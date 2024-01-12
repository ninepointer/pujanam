const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");

exports.getAllBooking = async (req, res) => {
    const userId = req.user._id;
    try {
        const booking = await Booking.find({user_id: new ObjectId(userId)})
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('pandits', 'pandit_name experience_in_year')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getBookingById = async (req, res) => {
    const {id} = req.params;
    try {
        const booking = await Booking.findOne({_id: new ObjectId(id)})
        .populate('paymentDetails', 'transaction_id payment_status payment_mode')
        .populate('pandits', 'pandit_name experience_in_year')
        .populate('tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};