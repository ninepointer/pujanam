const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const orderController = require('../../controllers/BookOrder/bookOrder');


// router.use('/user', user)

router.post('/', Authenticate, orderController.order);
router.get('/my', Authenticate, orderController.myOrder);


module.exports=router;