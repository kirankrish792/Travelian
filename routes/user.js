const express = require('express')
const router = express.Router()
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const user = require('../controllers/user')
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { profileImage } = require('../cloudinary');
const upload = multer({ storage: profileImage });

router.route("/register").get(user.registerForm).post(upload.single("image"),catchAsync(user.newUser));

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', isLoggedIn, user.logout);

router.get('/profile', isLoggedIn, user.profile)
.get('/profile/delete', isLoggedIn, user.deleteUser);

router.route('/user/:id')
.get(user.getUser)

module.exports = router;