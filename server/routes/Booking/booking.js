const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const user = require('../../routes/Booking/userBooking');
const restrictTo = require('../../authentication/authorization');
const bookingController = require('../../controllers/Booking/booking');


router.use('/user', user)

router.get('/pending', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookingController.getAllPending);
router.get('/approve', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookingController.getAllApproved);
router.get('/confirm', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookingController.getAllConfirmed);
router.get('/complete', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookingController.getAllCompleted);
router.get('/reject', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookingController.getAllRejected);

module.exports=router;

module.exports=router;