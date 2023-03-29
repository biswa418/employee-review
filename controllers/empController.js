const User = require('../models/user');
const Review = require('../models/review');
const adminController = require('./adminController');

// creating a user (not admin)
module.exports.createUser = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            req.flash('error', 'Password is not matching');
            return res.redirect('/users/register');
        }

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            req.flash('warning', "user already exist");
            return res.redirect('back');
        }
        else {

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            req.flash('success', "User created successfully");
            return res.redirect('/users/sign-in');
        }

    } catch (err) {
        console.log('Error in creating user', err);
        return res.redirect('/users/create');
    }
}

//render the sign up page
module.exports.signup = function (req, res) {
    return res.render('sign_up', {
        title: "Employee Review | Sign up"
    });
}

//render the sign in page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('sign_in', {
        title: "Employee Review | Sign in"
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


// home - see list of employees to give feedback
module.exports.home = async function (req, res) {
    try {
        // check user is not logged in
        if (!req.isAuthenticated()) {
            req.flash('error', 'Need to login');
            return res.redirect('/users/login');
        }

        //find the user and review
        let user = await User.findById(req.user.id).select('-password').populate({
            path: 'sendReview',
            select: '-password'
        }).populate({ path: 'gotReview', select: '-password' });

        //check if user is admin render a different page
        if (user.isAdmin) {
            adminController.adminPage(req, res);
            return;
        }

        let review = await Review.find({ to: req.user.id }).populate({
            path: 'from',
            select: '-password'
        })
            .populate({
                path: 'to',
                select: '-password'
            });

        return res.render('home', {
            title: "Employee Review | Home",
            reviews: review,
            user: user,
            current: user
        });
    } catch (err) {
        console.log('Error in loading homepage', err);
        return;
    }

}