const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const bookingController = require('../../controllers/Booking/userBooking');


router.get('/', Authenticate, bookingController.getAllBooking);
router.get('/:id', Authenticate, bookingController.getBookingById);

module.exports=router;