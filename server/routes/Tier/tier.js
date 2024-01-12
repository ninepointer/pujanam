const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const tierController = require('../../controllers/tierController');
const restrictTo = require('../../authentication/authorization');

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.createTier);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.getTiers);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.getActiveTiers);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.getTierById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.editTier);
// router.patch('/additionalinfo/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), tierController.additionalInformationPandit);


module.exports=router;