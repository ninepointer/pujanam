const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const deviDevtaController = require('../../controllers/DeviDevta/devi-devtaController');


router.get('/', Authenticate, deviDevtaController.getAllDevta);
router.get('/:id', Authenticate, deviDevtaController.getDevtaById);


module.exports=router;