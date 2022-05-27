const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('User/register')
}

module.exports.newUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
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
    res.redirect(redirectUrl);
}


module.exports.logout = function (req, res, next) {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    });
}