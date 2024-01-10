const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const panditController = require('../../controllers/panditController');
const restrictTo = require('../../authentication/authorization');

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.createPandit);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getAllPandits);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getActivePandits);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getPanditById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.editPandit);
router.patch('/additionalinfo/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.additionalInformationPandit);


module.exports=router;