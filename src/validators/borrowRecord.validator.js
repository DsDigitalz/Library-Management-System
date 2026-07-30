const { body, param, query } = require('express-validator');

const borrowBookValidator = [
  body('bookId')
    .isMongoId()
    .withMessage('Valid book ID is required'),
  body('memberId')
    .isMongoId()
    .withMessage('Valid member ID is required'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
];

const returnBookValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid borrow record ID format'),
];

const getBorrowRecordByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid borrow record ID format'),
];

const queryBorrowRecordValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('memberId')
    .optional()
    .isMongoId()
    .withMessage('Invalid member ID filter'),
  query('bookId')
    .optional()
    .isMongoId()
    .withMessage('Invalid book ID filter'),
  query('status')
    .optional()
    .isIn(['borrowed', 'returned', 'overdue'])
    .withMessage('Status must be borrowed, returned, or overdue'),
];

module.exports = {
  borrowBookValidator,
  returnBookValidator,
  getBorrowRecordByIdValidator,
  queryBorrowRecordValidator,
};
