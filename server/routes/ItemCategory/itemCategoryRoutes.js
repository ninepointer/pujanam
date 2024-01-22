const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const itemCategoryController = require('../../controllers/itemCategoryController');
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), itemCategoryController.createItemCategory);
router.get('/', Authenticate, itemCategoryController.getAllItemCategories);
router.get('/active', Authenticate, itemCategoryController.getAllActiveItemCategories);
router.get('/draft', Authenticate, itemCategoryController.getAllDraftItemCategories);
router.get('/inactive', Authenticate, itemCategoryController.getAllInActiveItemCategories);

router.get('/:id', Authenticate, itemCategoryController.getItemCategory);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("photo"), itemCategoryController.editItemCategory);


module.exports=router;