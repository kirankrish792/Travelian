const campground = require("../models/campground");
const User = require("../models/user");
const review = require("../models/review");
const { cloudinary } = require("../cloudinary");

module.exports.registerForm = (req, res) => {
    res.render('User/register')
}

module.exports.newUser = async (req, res, next) => {
    try {
        const { username, password, email, name, number } = req.body;
        const newUser = new User({ username, email, name, number });
        if(req.file) {
            const image = {url: req.file.path, filename: req.file.filename};
            newUser.images = image;
        }
        registerUser = await User.register(newUser, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'User created successfully');
            const redirectUrl = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        })
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('User/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Successfully logged in');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    if(req.user.isAdmin) {
        return res.redirect('/admin');
    }
    res.redirect(redirectUrl);
}


module.exports.logout = function (req, res, next) {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    });
}

module.exports.profile = async (req, res, next)=> {
    const user = await User.findById(req.user._id).populate('campgrounds').populate('reviews')
    res.render('User/profile', { user });
    // res.send(user)
}

module.exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.user._id).populate("campgrounds");
    for (let campground of user.campgrounds) {
      for (image of campground.images) {
        await cloudinary.uploader.destroy(image.filename);
      }
    }
    if(user.images) {
    await cloudinary.uploader.destroy(user.images.filename);
    }
    await campground.deleteMany({ _id: { $in: user.campgrounds } });
    await review.deleteMany({ _id: { $in: user.reviews } });
    await user.remove();
    res.redirect('/');
}

module.exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id).populate('campgrounds').populate('reviews');
    res.render('User/profile', { user });
}