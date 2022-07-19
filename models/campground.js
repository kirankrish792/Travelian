const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100,h_100,c_scale');
});


const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    verification: {
        type: String,
        enum: ['pending', 'verified', 'rejected',false],   
        default: false,
        required: true,
    }
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong><p>${this.description.substring(0, 20)}...</p>`
});

campgroundSchema.virtual('averageRating').get(function () {
    if (this.reviews.length === 0) {
        return 0;
    }
    const ratings = this.reviews.map(review => review.rating);
    return ratings.reduce((sum, rating) => sum + rating) / ratings.length;
})

campgroundSchema.post('findOneAndDelete', async doc => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
})


module.exports = mongoose.model('Campground', campgroundSchema);