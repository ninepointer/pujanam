const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const { getCarousels, getCarousel, editCarousel, deleteCarousel, createCarousel,
uploadMulter, uploadToS3, resizePhoto, getActiveCarousels, getLiveCarousels, getHomePageCarousels,
getDamCarousels, getPopularCarousels, getPoojaCarousels, getMandirCarousels,
getStoreCarousels, getUpcomingCarousels, getDraftCarousels, getPastCarousels, saveCarouselClick } = require('../../controllers/carousalController');

const router = express.Router();


router.route('/').get(getCarousels).post(Authenticate, restrictTo('Admin', 'Super Admin'), uploadMulter, resizePhoto, uploadToS3 ,createCarousel);
router.route('/active').get(getActiveCarousels)
router.route('/live').get(Authenticate, getLiveCarousels)
router.route('/upcoming').get(getUpcomingCarousels)
router.route('/home').get(Authenticate,getHomePageCarousels)
router.route('/dham').get(Authenticate,getDamCarousels)
router.route('/popular').get(Authenticate,getPopularCarousels)
router.route('/pooja').get(Authenticate,getPoojaCarousels)
router.route('/store').get(Authenticate,getStoreCarousels)
router.route('/mandir').get(Authenticate,getMandirCarousels)
router.route('/draft').get(Authenticate, getDraftCarousels)
router.route('/past').get(Authenticate, getPastCarousels)
router.route('/carouselclick/:id').patch(Authenticate, saveCarouselClick)
router.route('/:id').get(Authenticate, getCarousel).patch(Authenticate,restrictTo('Admin', 'Super Admin'), uploadMulter, resizePhoto, 
uploadToS3,editCarousel).delete(Authenticate, restrictTo('Admin', 'Super Admin'), deleteCarousel);


module.exports=router;