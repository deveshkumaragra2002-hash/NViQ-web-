const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();

const contactCtrl  = require('../controllers/contactController');
const { protect }  = require('../middleware/auth');

// ─── Validators ───────────────────────────────────────────────────────────────
const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .customSanitizer(v => v.replace(/[\s\-\+]/g, '').replace(/^91/, ''))
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Enter a valid 10-digit mobile number'),
  body('message')
    .trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 2000 }).withMessage('Message must be 5–2000 characters'),
  body('source')
    .optional()
    .isIn(['contact-form', 'lead-modal', 'other', 'gps-enquiry', 'mf-enquiry', 'fastag-enquiry', 'drone-enquiry']),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
// Public — Angular contact form posts here
router.post('/', contactRules, contactCtrl.submitContact);

// Admin protected
router.get('/',             protect, contactCtrl.getContacts);
router.patch('/:id/status', protect, contactCtrl.updateStatus);
router.delete('/:id',       protect, contactCtrl.deleteContact);

module.exports = router;
