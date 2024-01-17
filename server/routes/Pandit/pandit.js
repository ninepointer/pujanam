const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const panditController = require('../../controllers/panditController');
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), panditController.resizePhoto, panditController.createPandit);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getAllPandits);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getActivePandits);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.getPanditById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), panditController.resizePhoto, panditController.editPandit);
router.patch('/additionalinfo/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.additionalInformationPandit);
router.delete('/deleteinfo/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), panditController.deleteInfo);


module.exports=router;