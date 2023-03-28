const User = require('../models/user');
const fs = require('fs');
const path = require('path');




//render the sign up page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('sign_up', {
        title: "Placement Cell | Sign up"
    });
}

//render the sign in page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('sign_in', {
        title: "Placement Cell | Sign in"
    });
}

//sign in and create a session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

//sign out
module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }

        req.flash('success', 'You have been logged out!!');
        res.redirect('/users/sign-in');
    });
}

module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', "Password doesn't match. Try Again!");
        return res.redirect('back');
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        let user = await User.create(req.body);

        if (user) {
            req.flash('success', 'User Created! Sign in to proceed!');
            return res.redirect('/users/sign-in');
        } else {
            req.flash('error', 'User cannot be created! Try again!');
        }

    } else {
        req.flash('warning', 'User already exist');
        return res.redirect('back');
    }
}
