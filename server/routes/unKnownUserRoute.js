const express = require("express");
const Authenticate = require('../authentication/authentication');
const router = express.Router({mergeParams: true});
const Controller = require('../controllers/unKnownUserController');


router.post('/mandir',  Controller.createUnknownMandir);
router.post('/pooja',  Controller.createUnknownPooja);

module.exports=router;