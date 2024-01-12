const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const mandirController = require('../../controllers/Mandir/userMandirController');


// router.get('/', Authenticate,  mandirController.getAllPooja);
// router.post('/booking', Authenticate,  mandirController.booking);
// router.get('/:id', Authenticate,  mandirController.getPoojaById);

module.exports=router;