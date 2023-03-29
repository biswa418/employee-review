const router = require('express').Router();
const reviewController = require('../controllers/reviewController');


router.post('/create', reviewController.create);
router.get('/delete/:id', reviewController.delete);

module.exports = router;