const Pooja = require('../../models/Pooja/poojaSchema');
const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");
const Payment = require("../../models/Payment/payment");
const mongoose = require('mongoose');

exports.getAllPooja = async (req, res) => {
    try {
        const pooja = await Pooja.find({status: "Published"})
        .populate('packages.tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');
        ApiResponse.success(res, pooja);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getPoojaById = async (req, res) => {
    const {id} = req.params;
    try {
        const pooja = await Pooja.findOne({_id: new ObjectId(id)})
        .populate('packages.tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');
        ApiResponse.success(res, pooja);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.booking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            latitude, longitude, address, pincode, city, state, country,
            full_name, mobile, booking_amount, poojaId, tierId, booking_date
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
            country: country
        }

        const payment = await Payment.create({
            //todo-vijay
            transaction_id: generateUniqueTransactionId(), payment_status: "UnPaid", payment_mode: "PAP", created_by: req.user._id
        });

        const createBooking = await Booking.create([{
            user_id: req.user._id, booking_date, transaction_date: new Date(), address_details, full_name, mobile,
            booking_amount, product_id: "659e81ea30fa1324fb3d2681", sub_product_id: poojaId, tier: tierId,
            status: "Success", created_by: req.user._id, paymentDetails: payment._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        ApiResponse.success(res, createBooking, 'Booked successfully!');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        ApiResponse.error(res, 'Something went wrong', 500, error.message);
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