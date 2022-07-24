const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("avatar").get(function () {
  return this.url.replace(
    "/upload",
    "/upload/c_thumb,g_adv_faces,f_auto,q_auto,g_auto:subject,g_face,h_500,w_500/r_max/c_scale,w_200/"
  );
});


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  number: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    default: "0000000000",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  images: ImageSchema,
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  verification: {
    type: String,
    enum: ["pending", "verified", "rejected", false],
    default: false,
    required: true,
  },
});

userSchema.virtual("width").get(function () {
  return `width:${(this.reviews.filter(x=> x.certified===true).length/this.reviews.length)*100}%`
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);