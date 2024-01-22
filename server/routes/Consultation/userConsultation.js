const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const consultationController = require('../../controllers/Consultation/userConsultation');


router.get('/', Authenticate, consultationController.getAllConsultation);
router.get('/:id', Authenticate, consultationController.getConsultationById);

module.exports=router;