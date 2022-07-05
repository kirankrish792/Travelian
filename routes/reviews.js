const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { reviewValidation, isLoggedIn, isReviewAuthor } = require('../middleware');

const { Review, reviewRating } = require('../models/review');


router.post('/', isLoggedIn, reviewValidation, catchAsync(review.postReview))



router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(review.delete))
    .post((review.reviewRating))

module.exports = router;