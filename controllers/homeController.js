const passport = require('passport');

module.exports.home = async function (request, response) {
    if (request.isAuthenticated()) {
        return response.render('home', {
            title: "Placement Cell | Home",
        });

    } else {
        return response.redirect('/users/sign-in');
    }
}