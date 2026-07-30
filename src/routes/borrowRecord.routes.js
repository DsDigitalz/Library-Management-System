const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {
  borrowBook,
  returnBook,
  getAllBorrowRecords,
  getBorrowRecordById,
  deleteBorrowRecord,
} = require('../controllers/borrowRecord.controller');
const {
  borrowBookValidator,
  returnBookValidator,
  getBorrowRecordByIdValidator,
  queryBorrowRecordValidator,
} = require('../validators/borrowRecord.validator');

router
  .route('/')
  .post(borrowBookValidator, validate, borrowBook)
  .get(queryBorrowRecordValidator, validate, getAllBorrowRecords);

router
  .route('/:id/return')
  .post(returnBookValidator, validate, returnBook);

router
  .route('/:id')
  .get(getBorrowRecordByIdValidator, validate, getBorrowRecordById)
  .delete(getBorrowRecordByIdValidator, validate, deleteBorrowRecord);

module.exports = router;
