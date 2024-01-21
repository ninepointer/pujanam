const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Consultation = require("../../models/Bookings/bookingSchema");

exports.getAllConsultation = async (req, res) => {
    const userId = req.user._id;
    try {
        const booking = await Consultation.find({user_id: new ObjectId(userId)})
        .populate('pandits', 'pandit_name experience_in_year')
        .select('-last_modified_by -created_by -created_on -last_modified_on -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getConsultationById = async (req, res) => {
    const {id} = req.params;
    try {
        const consultation = await Consultation.findOne({_id: new ObjectId(id)})
        .populate('pandits', 'pandit_name experience_in_year')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v');
        ApiResponse.success(res, booking);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.createConsultation = async (req, res) => {
    try {
        const {
            latitude, longitude, address, pincode, city, state, country,
            mobile, booking_amount, booking_date, type,
            tag,
            landmark,
            locality,
            house_or_flat_no,
            floor,
            contact_name,
            contact_number,
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
            contact_name,
            contact_number,
        }

        const createConsultation = await Consultation.create([{
            user_id: req.user._id, booking_date, type, address_details, mobile,
            booking_amount, created_by: req.user._id
        }]);

        ApiResponse.created(res, createConsultation, 'Devta\s created successfully');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};