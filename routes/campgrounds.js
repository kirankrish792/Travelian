const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, campgroundValidation } = require('../middleware');

const campgrounds = require('../controllers/campground');

router.route('/')
    .get(catchAsync(campgrounds.renderCampgrounds))
    .post(isLoggedIn, campgroundValidation, catchAsync(campgrounds.newCampground))


router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewCampground)


router.route('/:id')
    .put(isLoggedIn, isAuthor, campgroundValidation, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .get(catchAsync(campgrounds.renderOneCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampground))


module.exports = router;