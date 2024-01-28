const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const reactionController = require('../../controllers/Reaction/reaction');
const restrictTo = require('../../authentication/authorization');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 10MB file size limit
  },
});

router.post('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("icon"), reactionController.resizePhoto, reactionController.createReaction);
router.get('/', Authenticate, restrictTo('Admin', 'SuperAdmin'), reactionController.getAllReactions);
router.get('/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), reactionController.getActiveReactions);
router.get('in/active', Authenticate, restrictTo('Admin', 'SuperAdmin'), reactionController.getInactiveReactions);
router.get('/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'), reactionController.getDraftReactions);
router.get('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), reactionController.getReactionById);
router.patch('/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'), upload.single("icon"), reactionController.resizePhoto, reactionController.editReaction);

module.exports=router;