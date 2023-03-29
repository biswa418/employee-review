const express = require('express');
const router = express.Router();
const passport = require('passport');
const empController = require('../controllers/empController');

router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), empController.createSession);
router.get('/sign-out', empController.destroySession);
router.get('/sign-in', empController.signin);
router.get('/sign-up', empController.signup);
router.post('/create', empController.createUser);

module.exports = router;