const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const mandirController = require('../../controllers/Mandir/userMandirController');


router.get('/', Authenticate,  mandirController.getActive);
router.get('/home',  mandirController.getActiveHome);
router.get('/dham', Authenticate,  mandirController.getDham);
router.get('/popular', Authenticate,  mandirController.getPopular);
router.patch('/addfavourite/:id', Authenticate,  mandirController.addToFavourite);
router.patch('/sharedby/:id', Authenticate,  mandirController.sharedBy);

module.exports=router;