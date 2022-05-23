const campground = require('../models/campground');
const Review = require('../models/review');


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