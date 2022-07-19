const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, campgroundValidation } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })


const campgrounds = require('../controllers/campground');

router.route('/')
    .get(catchAsync(campgrounds.renderCampgrounds))
    .post(isLoggedIn, upload.array('image'), campgroundValidation, catchAsync(campgrounds.newCampground))

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewCampground)


router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), campgroundValidation, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .get(catchAsync(campgrounds.renderOneCampground))


router.route('/:id/verify')
    .post(isLoggedIn, isAuthor, catchAsync(campgrounds.verifyCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampground))


module.exports = router;