const campground = require("../models/campground");
const User = require("../models/user");
const review = require("../models/review");
const { cloudinary } = require("../cloudinary");

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
    res.redirect(`/admin`);
}

module.exports.users = async (req, res) => {
    const users = await User.find({})
    .populate("campgrounds")
    .populate("reviews");
    res.render("admin/users",{users});
}

module.exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate("campgrounds");
    for(let campground of user.campgrounds){
        for(image of campground.images){
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    if (user.images) {
      await cloudinary.uploader.destroy(user.images.filename);
    }
    await campground.deleteMany({_id: {$in: user.campgrounds}});
    await review.deleteMany({_id: {$in: user.reviews}});
    await user.remove();
    res.redirect("/admin/users");
}

module.exports.verifyUserAdmin = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error","User not found");
    return res.redirect("/admin/users");
  }
  user.verification = req.body.verification.value;
  await user.save();
  res.redirect(`/admin/users`);
};