const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema

const reviewRating = new Schema({
  value: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model('ReviewRating',reviewRating)