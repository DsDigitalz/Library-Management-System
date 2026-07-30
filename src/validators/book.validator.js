const { body, param, query } = require('express-validator');

const createBookValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Book title is required'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author name is required'),
  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required'),
  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),
  body('publishedYear')
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage(`Published year must be a valid year (1000-${new Date().getFullYear() + 1})`),
  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be at least 1'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies cannot be negative'),
];

const updateBookValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid book ID format'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Book title cannot be empty'),
  body('author')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Author name cannot be empty'),
  body('isbn')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('ISBN cannot be empty'),
  body('genre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Genre cannot be empty'),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage('Invalid published year'),
  body('totalCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total copies cannot be negative'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies cannot be negative'),
  body('status')
    .optional()
    .isIn(['available', 'maintenance', 'out_of_stock'])
    .withMessage('Status must be available, maintenance, or out_of_stock'),
];

const getBookByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid book ID format'),
];

const queryBookValidator = [
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
  query('genre')
    .optional()
    .trim(),
  query('status')
    .optional()
    .isIn(['available', 'maintenance', 'out_of_stock'])
    .withMessage('Invalid status filter'),
];

module.exports = {
  createBookValidator,
  updateBookValidator,
  getBookByIdValidator,
  queryBookValidator,
};
