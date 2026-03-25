const { body, validationResult } = require('express-validator');

// ─── Reusable error handler ───────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Create review rules ──────────────────────────────────────────────────────
exports.createReviewRules = [
  body('doctor_id')
    .notEmpty().withMessage('doctor_id is required')
    .isInt({ min: 1 }).withMessage('doctor_id must be a positive integer'),
  body('patient_id')
    .notEmpty().withMessage('patient_id is required')
    .isInt({ min: 1 }).withMessage('patient_id must be a positive integer'),
  body('patient_name')
    .notEmpty().withMessage('patient_name is required')
    .isString().withMessage('patient_name must be a string')
    .isLength({ max: 255 }).withMessage('patient_name max 255 characters'),
  body('rating')
    .notEmpty().withMessage('rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('rating must be an integer between 1 and 5'),
  body('review_text')
    .optional({ nullable: true })
    .isString().withMessage('review_text must be a string')
    .isLength({ max: 1000 }).withMessage('review_text max 1000 characters'),
  body('status')
    .optional()
    .isIn(['Visible', 'Hidden', 'Reported']).withMessage('status must be Visible, Hidden, or Reported'),
  validate,
];

// ─── Update review rules ──────────────────────────────────────────────────────
exports.updateReviewRules = [
  body('patient_name')
    .optional()
    .isString().withMessage('patient_name must be a string')
    .isLength({ max: 255 }).withMessage('patient_name max 255 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('rating must be an integer between 1 and 5'),
  body('review_text')
    .optional({ nullable: true })
    .isString().withMessage('review_text must be a string')
    .isLength({ max: 1000 }).withMessage('review_text max 1000 characters'),
  body('status')
    .optional()
    .isIn(['Visible', 'Hidden', 'Reported']).withMessage('status must be Visible, Hidden, or Reported'),
  validate,
];
