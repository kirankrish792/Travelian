const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { reviewValidation, isLoggedIn, isReviewAuthor } = require('../middleware');

const { Review, reviewRating } = require('../models/review');


router.post('/', isLoggedIn, reviewValidation, catchAsync(review.postReview))


<<<<<<< HEAD
router
  .delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(review.delete))
  .post("/:reviewId",isLoggedIn, catchAsync(review.postRating));
=======

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(review.delete))
    .post((review.reviewRating))
>>>>>>> 374e98b39449131a4f083e50c2e4870357400a25

module.exports = router;