const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    async function (req, email, password, done) {
        let user = await User.findOne({ email: email });

        if (!user || user.password != password) {
            req.flash('error', 'Invalid Username/ Password');
            return done(null, false);
        }

        return done(null, user);
    }

));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
    let user = await User.findById(id);

    if (user) {
        return done(null, user);
    } else { console.log('Error in finding user --> deserializing'); return done('Error'); }
});


//check if user is authenticated -- middleware
passport.checkAuthentication = function (req, res, next) {
    // if the user is signed in, then pass on the request to the next function
    if (req.isAuthenticated()) {
        return next();
    }

    //if not signed in
    return res.redirect('/users/sign-in');
}

//set the authentication
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current session ...so sending it to the views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;