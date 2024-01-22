const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const itemController = require('../../controllers/itemController');
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), itemController.createItem);
router.get('/', Authenticate, itemController.getAllItems);
router.get('/active', Authenticate, itemController.getAllActiveItems);
router.get('/inactive', Authenticate, itemController.getAllInActiveItems);
router.get('/draft', Authenticate, itemController.getAllDraftItems);
router.get('/category/:id', Authenticate, itemController.getAllItemsByCategory);
router.get('/:id', Authenticate, itemController.getItemById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), itemController.editItem);

module.exports=router;