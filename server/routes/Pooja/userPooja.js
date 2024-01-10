const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const poojaController = require('../../controllers/Pooja/userPoojaController');


router.get('/', Authenticate,  poojaController.getAllPooja);
// router.get('/active', Authenticate,  poojaController.getActivePoojas);
// router.get('/:id', Authenticate,  poojaController.getPoojaById);

module.exports=router;