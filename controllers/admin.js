const campground = require("../models/campground");
const User = require("../models/user");

module.exports.dashboard = async (req, res) => {
    const campgrounds = await campground.find({})
    .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author")
    res.render("admin/index",{campgrounds});
};

module.exports.verifyCampgroundAdmin = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campground.findById(id);
    if (!campgrounds) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    campgrounds.verification = req.body.verification.value;
    await campgrounds.save();
    req.flash('success', 'Application sent successfully');
    res.redirect(`/admin`);
}

module.exports.users = async (req, res) => {
    const users = await User.find({})
    .populate("campgrounds")
    .populate("reviews");
    res.render("admin/users",{users});
}