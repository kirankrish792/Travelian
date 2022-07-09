const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
<<<<<<< HEAD
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviewRating: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReviewRating",
    },
  ],
  certified: {
    type: Boolean,
    default: false,
    required: true,
  }
});


=======
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
>>>>>>> 374e98b39449131a4f083e50c2e4870357400a25
module.exports = mongoose.model("Review", reviewSchema);