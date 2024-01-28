const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const cartController = require('../../controllers/cartController');


router.route('/').get(Authenticate, cartController.getUserCart);
router.route('/add').post(Authenticate, cartController.addItemToCart);
router.route('/remove').post(Authenticate, cartController.removeItemFromCart);


module.exports=router;