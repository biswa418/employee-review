const User = require('../models/user');
const Review = require('../models/review');
const passport = require('passport');

// create a review
module.exports.create = async function (req, res) {
    try {
        //find to whom
        let receipient = await User.findById(req.body.from).select('-password');

        if (!receipient) {
            req.flash('error', 'Could not add the review. Try Again.');
            return res.redirect('back');
        }

        //check if sender is eligible then create the report
        if (receipient.gotReview.indexOf(req.user.id) > -1) {
            await Review.create({
                from: req.user._id,
                to: receipient._id,
                review: req.body.review
            });
        }

        req.flash('success', 'Review submited successfully');
        return res.redirect('back');
    } catch (err) {
        console.log("Error in creating the report", err);
        return;
    }

};

//delete a review
module.exports.delete = async function (req, res) {
    try {
        //find if user is admin
        if (!req.user.isAdmin) {
            req.flash('error', 'Insufficient preiviledges');
        }

        //find the review
        await Review.findByIdAndDelete(req.query.id);

        req.flash('success', 'Review deleted successfully');
        return res.redirect('back');
    } catch (err) {
        console.log("Error in creating the report", err);
        return;
    }

};