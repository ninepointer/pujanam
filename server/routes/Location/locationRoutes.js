const express = require("express");
const router = express.Router({mergeParams: true});
const locationController = require('../../controllers/locationController');


router.get('/search', locationController.searchLocationFromText);
router.get('/autocomplete', locationController.autoComplete);
router.get('/currentplace', locationController.currentPlace);
router.get('/placedetails', locationController.placeDetails);



module.exports=router;