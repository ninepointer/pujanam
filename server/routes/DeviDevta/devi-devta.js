const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const deviDevtaController = require('../../controllers/DeviDevta/devi-devtaController');
const user = require('./userDeviDevta')
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.use("/user", user)
router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.single("devImage"), deviDevtaController.resizePhoto, deviDevtaController.create);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.getAllDevta);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.getActiveDevta);
router.get('/inactive', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.getInActiveDevta);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.getDevtaById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.single("devImage"), deviDevtaController.resizePhoto, deviDevtaController.edit);
router.patch('/othername/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.addOtherDevta);
router.patch('/associate/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.addAssociateDevta);
router.patch('/geography/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.addGeography);

router.delete('/deleteothername/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.deleteOtherDevta);
router.delete('/deleteassociate/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.deleteAssociateDevta);
router.delete('/deletegeography/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), deviDevtaController.deleteGeography);


module.exports=router;