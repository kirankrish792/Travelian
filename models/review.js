const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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


module.exports = mongoose.model("Review", reviewSchema);