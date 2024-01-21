const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const user = require('../Consultation/userConsultation');
const restrictTo = require('../../authentication/authorization');
const consultationController = require('../../controllers/Consultation/consultation');
const { uploadMulter, uploadToS3, resizePhoto } = consultationController;


router.use('/user', user)

router.get('/pending', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.getAllPending);
router.get('/approve', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.getAllApproved);
router.get('/confirm', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.getAllConfirmed);
router.get('/complete', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.getAllCompleted);
router.get('/reject', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.getAllRejected);

router.patch('/approve/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.approveConsultation);
router.patch('/reject/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.rejectConsultation);
router.patch('/confirm/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), consultationController.confirmConsultation);
router.patch('/complete/:id', Authenticate, restrictTo('Admin', 'Super Admin'), uploadMulter, uploadToS3, consultationController.completeConsultation);

module.exports=router;
