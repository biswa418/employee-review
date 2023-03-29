const router = require('express').Router();
const adminController = require('../controllers/adminController');


router.get('/view', adminController.viewEmployees);
router.get('/delete/:id', adminController.deleteEmployee);
router.get('/viewReviews', adminController.reviews);
router.post('/make', adminController.newAdmin);
router.get('/addreview', adminController.addreviews);
router.post('/update', adminController.setReviews);

module.exports = router;