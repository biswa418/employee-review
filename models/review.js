const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //who made the review
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //whose name is on review
        required: true
    }
}, {
    timestamps: true,
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;