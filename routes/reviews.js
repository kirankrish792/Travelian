const express = require('express');
const router = express.Router({ mergeParams: true });

const campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');



const reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else {
        next();
    }
}





router.post('/', reviewValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    const { body, rating } = req.body.review;
    const newReview = new Review({ body, rating });
    findCampground.reviews.push(newReview);
    await newReview.save();
    await findCampground.save();
    res.redirect(`/campgrounds/${id}`);
}))



router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;