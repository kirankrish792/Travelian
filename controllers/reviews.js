const campground = require('../models/campground');
const User = require("../models/user");
const Review = require('../models/review');
const ReviewRating = require('../models/reviewRating')


module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const findCampground = await campground.findById(id);
    const { body, rating } = req.body.review;
    const newReview = new Review({ body, rating });
    findCampground.reviews.push(newReview);
    newReview.author = req.user._id;
    user.reviews.push(newReview);
    await user.save();
    await newReview.save();
    await findCampground.save();
    req.flash('success', 'Review created successfully');
    res.redirect(`/campgrounds/${id}`);
}


module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { reviews: reviewId } });
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.postRating = async(req,res)=>{
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("reviewRating");
    const { value } = req.body.reviewRating 
    const reviewRate = new ReviewRating({ value });
    let total = 0;
    for(let values of review.reviewRating){
        total += values.value
    }
    let avg = total/review.reviewRating.length;
    console.log(avg)
    if(avg>3.5){
        review.certified = true
    }
    else{
        review.certified = false
    }
    reviewRate.author = req.user._id;
    review.reviewRating.push(reviewRate)
    const data = await reviewRate.save()
    await review.save();
    req.flash('success',"Rated Review Successfully")
    res.redirect(`/campgrounds/${id}`);
}