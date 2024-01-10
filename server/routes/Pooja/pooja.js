const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const poojaController = require('../../controllers/Pooja/poojaController');
const user = require('../../routes/Pooja/userPooja');

const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.use('/user', user)

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.single("poojaImage"), poojaController.createPooja);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.getAllPoojas);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.getActivePoojas);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.getPoojaById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),  upload.single("poojaImage"), poojaController.editPooja);
router.patch('/purpose/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.addPurpose);
router.patch('/benefits/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.addBenefits);
router.patch('/description/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.addDescription);
router.patch('/faq/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), poojaController.addFaq);



module.exports=router;