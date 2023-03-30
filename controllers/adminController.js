const User = require('../models/user');
const Review = require("../models/review");
const fs = require('fs');
const path = require('path');
const passport = require('passport');

//home page for a admin
module.exports.adminPage = async function (req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Session expired, please log in');
        return res.redirect('/users/login');
    }
    else {
        if (!req.user.isAdmin) {
            req.flash('error', 'Need admin privileges');
            return res.redirect('back');
        } else {
            try {
                //find all the users
                let user = await User.find({}).select('-password').populate('sendReview').populate('gotReview');
                let current = await User.findById(req.user.id).select('-password').populate({
                    path: 'sendReview',
                    select: '-password'
                }).populate({
                    path: 'gotReview',
                    select: '-password'
                });

                let reviews = await Review.find({ to: current.id }).populate({
                    path: 'from',
                    select: '-password'
                }).populate({
                    path: 'to',
                    select: '-password'
                });

                let notAdmins = [];

                for (let i of user) {
                    if (!i.isAdmin) {
                        notAdmins.push(i);
                    }
                }

                return res.render('admin', {
                    title: "Employee Review | Admin page",
                    users: user,
                    current: current,
                    reviews: reviews,
                    notAdmins: notAdmins
                });
            } catch (err) {
                console.log('Error in loading admin page', err);
                return;
            }
        }
    }
};

//view all the reviews
module.exports.reviews = async function (req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Session expired, please log in');
        return res.redirect('/users/login');
    }
    else {
        if (!req.user.isAdmin) {
            req.flash('error', 'Need admin privileges');
            return res.redirect('back');
        } else {
            try {
                //find all the reviews
                let reviews = await Review.find({}).populate({
                    path: 'from',
                    select: '-password'
                }).populate({
                    path: 'to',
                    select: '-password'
                });

                return res.render('reviews', {
                    title: "Employee Review | Review page",
                    reviews: reviews,
                });
            } catch (err) {
                console.log('Error in loading review page', err);
                return;
            }
        }
    }
}

//load add review form
module.exports.addreviews = async function (req, res) {

    let users = await User.find({}).select('-password');
    let reviews = await Review.find({}).populate({
        path: 'from',
        select: '-password'
    }).populate({
        path: 'to',
        select: '-password'
    });;

    return res.render('addReview', {
        title: 'Employee Review | Add',
        users: users,
        reviews: reviews
    });
}

// set review for employee
module.exports.setReviews = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/users/sign-in');
        } else {
            let employee = await User.findById(req.user.id);

            if (!employee.isAdmin) {
                req.flash('error', "Not an admin");
                return res.redirect('back');
            } else if (req.body.from == req.body.to) {
                req.flash('warning', "Reviewer and Reviewee are the same.");
                return res.redirect('back');
            } else {

                let reviewer = await User.findById(req.body.from).select('-password');

                // recheck reviewer
                if (!reviewer) {
                    return res.redirect('back');
                }

                let receipient = await User.findById(req.body.to).select('-password');

                //recheck receipient
                if (!receipient) {
                    return res.redirect('back');
                }

                //push if already not there
                if (reviewer.sendReview.indexOf(receipient.id) < 0) {
                    reviewer.sendReview.push(receipient);
                    reviewer.save();

                    receipient.gotReview.push(reviewer);
                    receipient.save();
                }

                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log("Error", err);
        return;
    }

};

// make admin to an employee
module.exports.newAdmin = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/users/sign-in');
        }

        if (req.user.isAdmin) {
            let employee = await User.findById(req.body.newAdmin);

            if (!employee) {
                req.flash('error', 'Employee not found');
                return res.redirect('back');
            }

            if (employee.isAdmin) {
                req.flash('warning', 'Already an admin!!');
                return res.redirect('back');
            }

            if (!employee.isAdmin) {
                employee.isAdmin = true;
                employee.save();

                req.flash('success', 'Gave admin access!!');
                return res.redirect('back');
            }
        } else {
            req.flash('error', 'Insufficient Prievledges');
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Error", err);
        return;
    };

};

// views employees
module.exports.viewEmployees = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                let emp = await User.find({}).select('-password');

                if (emp) {
                    return res.render('employee', {
                        title: "Employee Review | Employees",
                        employees: emp,
                    });
                }
            } else {
                req.flash('error', 'Unauthorized');
                return res.redirect('back');
            }
        } else {
            req.flash('error', "User not signed in.");
            return res.redirect("/users/sign-in");
        }
    } catch (err) {
        console.log("Error in viewing employees", err);
        return;
    }
};

// find and delete employee
module.exports.deleteEmployee = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            if (req.user.id == req.params.id) {
                req.flash('error', 'Cannot remove yourself from the list');
                return res.redirect('back');
            }

            if (req.user.isAdmin) {
                await User.findByIdAndDelete(req.params.id);

                let reviewsSent = await Review.find({ from: req.params.id });
                let reviewsReceived = await Review.find({ to: req.params.id });

                await Review.findByIdAndDelete(reviewsSent.id);
                await Review.findByIdAndDelete(reviewsReceived.id);

                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log("Error in deleting", err);
        return;
    }

};