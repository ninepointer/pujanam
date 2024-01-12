const express = require("express");
// const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
// const poojaController = require('../../controllers/Pooja/poojaController');
const user = require('../../routes/Booking/userBooking');

// const restrictTo = require('../../authentication/authorization');


router.use('/user', user)

module.exports=router;