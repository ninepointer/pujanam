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

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.array('poojaImages', 50), mandirController.createPooja);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirController.getAllPoojas);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirController.getActivePoojas);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirController.getPoojaById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.array('poojaImages', 50), mandirController.editPooja);




module.exports=router;