const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reviewController');
const { createReviewRules, updateReviewRules } = require('../middleware/validators');

// POST   /reviews          → add new review
router.post('/',          createReviewRules, ctrl.createReview);

// GET    /reviews/:doctor_id  → all reviews for a doctor
router.get('/:doctor_id', ctrl.getReviewsByDoctor);

// GET    /reviews/single/:id  → single review
router.get('/single/:id', ctrl.getReviewById);

// PUT    /reviews/:id      → update review
router.put('/:id',        updateReviewRules, ctrl.updateReview);

// DELETE /reviews/:id      → delete review
router.delete('/:id',     ctrl.deleteReview);

module.exports = router;
