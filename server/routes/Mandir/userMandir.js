const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const mandirController = require('../../controllers/Mandir/userMandirController');


router.get('/', Authenticate,  mandirController.getActive);
router.get('/home',  mandirController.getActiveHome);
router.get('/allhome',  mandirController.getActiveAllHome);
router.get('/homedham',  mandirController.getDhamHomeActive);
router.get('/homepopular',  mandirController.getPopularMandirHomeActive);
router.get('/allhomepopular',  mandirController.getAllPopularMandirHomeActive);
router.get('/dham', Authenticate,  mandirController.getDham);
router.get('/popular', Authenticate,  mandirController.getPopular);
router.get('/bydistance',  mandirController.getByDistance);
router.get('/bydevta',  mandirController.getBydevta);
router.get('/bysearch',  mandirController.getBySearch);

router.patch('/count/:id', Authenticate,  mandirController.addToFavourite);
router.patch('/addfavourite/:id', Authenticate,  mandirController.addToFavourite);
router.patch('/unfavourite/:id', Authenticate,  mandirController.unfavouriteTemple);

router.patch('/sharedby/:id', Authenticate,  mandirController.sharedBy);
router.patch('/addCount/:id', Authenticate,  mandirController.viewCount);

module.exports=router;