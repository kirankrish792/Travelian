const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewRating: [
        {
            type: Schema.Types.ObjectId,
            ref: 'reviewRating'
        }
    ]
});


const reviewRatingSchema = new Schema({
    rating: Number,
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});




module.exports = mongoose.model("reviewRating", reviewRatingSchema);
module.exports = mongoose.model("Review", reviewSchema);