const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const mandirPostController = require('../../controllers/MandirPost/mandirPost');
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 10MB file size limit
  },
});

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), mandirPostController.resizePhoto, mandirPostController.createMandirPost);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirPostController.getAllMandirPosts);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirPostController.getActiveMandirPosts);
router.get('in/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirPostController.getInactiveMandirPosts);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirPostController.getDraftMandirPosts);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), mandirPostController.getMandirPostById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), mandirPostController.resizePhoto, mandirPostController.editMandirPost);

module.exports=router;