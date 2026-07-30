const { body, param, query } = require('express-validator');

const createMemberValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Member name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('membershipType')
    .optional()
    .isIn(['standard', 'premium', 'student'])
    .withMessage('Membership type must be standard, premium, or student'),
];

const updateMemberValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid member ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Member name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  body('membershipType')
    .optional()
    .isIn(['standard', 'premium', 'student'])
    .withMessage('Membership type must be standard, premium, or student'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended'),
];

const getMemberByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid member ID format'),
];

const queryMemberValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim(),
  query('membershipType')
    .optional()
    .isIn(['standard', 'premium', 'student'])
    .withMessage('Invalid membership type filter'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid status filter'),
];

module.exports = {
  createMemberValidator,
  updateMemberValidator,
  getMemberByIdValidator,
  queryMemberValidator,
};
