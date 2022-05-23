const campground = require('../models/campground');


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
    const newCampground = new campground(req.body.campground);
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
    await campground.findByIdAndUpdate(id, req.body.campground);
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
    const campgrounds = await campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')
    if (!campgrounds) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}