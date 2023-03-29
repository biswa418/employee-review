const express = require('express');
const router = express.Router();
const empController = require('../controllers/empController');
const passport = require('passport');

console.log('started routing');

router.get('/', passport.checkAuthentication, empController.home);
router.use('/users', require('./users'));
router.use('/admin', require('./admins'));
router.use('/review', require('./report'));

module.exports = router;