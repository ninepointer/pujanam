const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const mandirController = require('../../controllers/Mandir/mandir');
const user = require('../../routes/Mandir/userMandir');

const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.use('/user', user)

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.fields([{ name: 'coverFiles', maxCount: 1 }, { name: 'files', maxCount: 100 }]), mandirController.create);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirController.getActive);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.fields([{ name: 'coverFiles', maxCount: 1 }, { name: 'files', maxCount: 100 }]), mandirController.edit);
router.patch('/removeimage/:id/:docId', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirController.removeImage);




module.exports=router;