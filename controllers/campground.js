const campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.renderCampgrounds = async (req, res) => {
    const campgrounds = await campground.find({});
    if (!campgrounds) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/index', { campgrounds });

}

module.exports.renderNewCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.newCampground = async (req, res) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCampground = new campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Campground created successfully');
    res.redirect(`/campgrounds/${newCampground._id}`);
}


module.exports.renderEditCampground = async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    if (!findCampground) {
        req.flash('error', 'Campground not found');
    }
    res.render('campgrounds/edit', { findCampground, id });
}
module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campgrounds.images.push(...imgs);
    await campgrounds.save();
    if (req.body.deleteImage) {
        typeof req.body.deleteImage === 'string' ? req.body.deleteImage = req.body.deleteImage.split() : null;
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await campgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Campground updated successfully');
    res.redirect(`/campgrounds/${id}`);

}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully');
    res.redirect('/campgrounds');
}

module.exports.renderOneCampground = async (req, res) => {
    const campgrounds = await campground
      .findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author")
      .populate({
        path: "reviews",
        populate: {
          path: "reviewRating",
          populate: {
            path: "author",
          },
        },
      });
    if (!campgrounds) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}