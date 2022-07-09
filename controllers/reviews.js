const campground = require('../models/campground');
<<<<<<< HEAD
const Review = require('../models/review');
const ReviewRating = require('../models/reviewRating')
=======
const { Review, reviewRating } = require('../models/review');
>>>>>>> 374e98b39449131a4f083e50c2e4870357400a25


module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    const { body, rating } = req.body.review;
    const newReview = new Review({ body, rating });
    findCampground.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await findCampground.save();
    req.flash('success', 'Review created successfully');
    res.redirect(`/campgrounds/${id}`);
}


module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}

<<<<<<< HEAD
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
=======
module.exports.reviewRating = async (req, res) => {
    
>>>>>>> 374e98b39449131a4f083e50c2e4870357400a25
}