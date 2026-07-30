const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/book.controller');
const {
  createBookValidator,
  updateBookValidator,
  getBookByIdValidator,
  queryBookValidator,
} = require('../validators/book.validator');

router
  .route('/')
  .post(createBookValidator, validate, createBook)
  .get(queryBookValidator, validate, getAllBooks);

router
  .route('/:id')
  .get(getBookByIdValidator, validate, getBookById)
  .put(updateBookValidator, validate, updateBook)
  .delete(getBookByIdValidator, validate, deleteBook);

module.exports = router;
