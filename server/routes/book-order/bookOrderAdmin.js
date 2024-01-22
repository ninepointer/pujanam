const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const user = require('../../routes/book-order/bookOrder');
const restrictTo = require('../../authentication/authorization');
const bookOrderController = require('../../controllers/BookOrder/bookOrderAdmin');
const { uploadMulter, uploadToS3, resizePhoto } = bookOrderController;


router.use('/user', user)

router.get('/pending', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.getAllPending);
router.get('/accept', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.getAllAccept);
router.get('/dispatch', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.getAllDispatched);
router.get('/deliver', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.getAllDelivered);
router.get('/reject', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.getAllRejected);

router.patch('/accept/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.acceptOrder);
router.patch('/reject/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.rejectOrder);
router.patch('/dispatch/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), bookOrderController.dispatchOrder);
router.patch('/deliver/:id', Authenticate, restrictTo('Admin', 'Super Admin'), uploadMulter, uploadToS3, bookOrderController.deliverOrder);


module.exports=router;