const Pooja = require('../../models/Pooja/poojaSchema');
const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb');
const Booking = require("../../models/Bookings/bookingSchema");
const Payment = require("../../models/Payment/payment");
const mongoose = require('mongoose');
const User = require("../../models/User/userSchema")
const {sendMultiNotifications} = require('../../utils/fcmService');
const emailService = require("../../utils/emailService");

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

exports.getHomePoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find()
        .limit(4)
        .populate('category', 'product_name');
        ApiResponse.success(res, poojas);
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
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
    const userId = req.user._id;

    try {
        const {
            latitude, longitude, address, pincode, city, state, country,
            full_name, mobile, booking_amount, poojaId, tierId, booking_date,
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

        const payment = await Payment.create([{
            transaction_id: generateUniqueTransactionId(), payment_status: "UnPaid", payment_mode: "PAP", created_by: req.user._id
        }], { session });

        const createBooking = await Booking.create([{
            user_id: req.user._id, booking_date, address_details, full_name, mobile,
            booking_amount, product_id: "659e81ea30fa1324fb3d2681", specific_product_id: poojaId, tier: tierId,
            created_by: req.user._id, payment_details: payment[0]._id
        }], { session });

        const user = await User.findOneAndUpdate({_id: new ObjectId(userId)}, {
            $push: {
                bookings: createBooking?.[0]._id
            }
        }, {session})

        await session.commitTransaction();
        session.endSession();

        const pooja = await Pooja.findById(new ObjectId(poojaId));
        const date = convertTime(booking_date);
        if (user?.fcm_tokens?.length > 0) {
            const poojaName = getPoojaName(pooja);
            await sendMultiNotifications('Pooja Booked',
                `${poojaName} pooja booked on ${date}. Our team will reach you shortly.`,
                user?.fcm_tokens?.map(item => item.token), null, { route: 'pooja' }
            )
        }

        let recipients = ["pooja@punyam.app", 'pooja@punyam.app'];
        let recipientString = recipients.join(",");
        let subject = "Pooja Booked";
        let message =
          `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Pooja Booked</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
    
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                    }
    
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
    
                    p {
                        margin: 0 0 20px;
                    }
    
                    .userid {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .password {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .login-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }
    
                    .login-button:hover {
                        background-color: #0069d9;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <p>Full Name: <span class="password">${user.full_name}</span></p>
                    <p>Email: <span class="password">${user.email}</span></p>
                    <p>Mobile: <span class="password">${user.mobile}</span></p>
                    <p>Pooja Name: <span class="password">${pooja.name}</span></p>
                    <p>Booking Amount: <span class="password">₹${booking_amount}/-</span></p>
                    <p>Booking Date: <span class="password">${date}</span></p>
                    </div>
                </body>
                </html>
    
            `
        // if (process.env.PROD === "true") {
          emailService(recipientString, subject, message);
        // }
        ApiResponse.success(res, createBooking);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};

function getPoojaName(data) {
    const inputString = data?.name;
    const searchString = "Pooja";

    const resultString = inputString.toLowerCase().includes(searchString.toLowerCase())
        ? inputString.replace(new RegExp(searchString, 'i'), "").trim()
        : inputString;

    const finalResult = resultString.charAt(0).toUpperCase() + resultString.slice(1);
    return finalResult
}

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

function generateUniqueTransactionId() {
    const maxLength = 36;
    const allowedCharacters = "0123456789";

    const timestampPart = "MTID" + Date.now().toString();
    const remainingLength = maxLength - timestampPart.length;
    const randomChars = Array.from({ length: 5 }, () => allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)]).join('');

    return timestampPart + randomChars;
}

exports.viewCount = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedPooja = await Pooja.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $inc: { viewCount: 1 } }, // Increment the count by 1
            { new: true } // Return the updated document
        ).select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');

        if (!updatedPooja) {
            return ApiResponse.error(res, 'Pooja not found', 404);
        }

        ApiResponse.success(res, updatedPooja, 'Count updated successfully!');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};


exports.trandingPooja = async (req, res) => {
    try {
        const pooja = await Pooja.find({featured: true}).sort({viewCount: -1})
        .populate('packages.tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');

        const pooja2 = await Pooja.find({featured: false}).sort({viewCount: -1})
        .populate('packages.tier', 'tier_name pooja_items_included post_pooja_cleanUp_included min_pandit_experience max_pandit_experience number_of_main_pandit number_of_assistant_pandit')
        .select('-created_by -created_on -last_modified_on -last_modified_by -__v -status');

        const result = pooja.concat(pooja2);
        const newArr = result.slice(0, 4);
        ApiResponse.success(res, newArr, 'Pooja featched successfully!');
    } catch (error) {
        ApiResponse.error(res, 'Something went wrong', 500, error.message);
    }
};