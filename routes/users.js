const express = require('express');
const router = express.Router();

const passport = require('passport');
const userController = require('../controllers/userController');


router.get('/sign-up', userController.signup);
router.get('/sign-in', userController.signin);
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), userController.createSession);
router.post('/create', userController.create);
router.get('/sign-out', userController.destroySession);

module.exports = router;