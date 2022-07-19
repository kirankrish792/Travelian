const express = require('express')
const router = express.Router()
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const user = require('../controllers/user')

router.route('/register')
    .get(user.registerForm)
    .post(user.newUser)

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', isLoggedIn, user.logout);

module.exports = router;