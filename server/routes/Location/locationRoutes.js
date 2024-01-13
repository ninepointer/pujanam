const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const locationController = require('../../controllers/locationController');

const restrictTo = require('../../authentication/authorization');



router.get('/search', locationController.searchLocationFromText);
router.get('/autocomplete', locationController.autoComplete);
router.get('/placedetails', locationController.placeDetails);



module.exports=router;