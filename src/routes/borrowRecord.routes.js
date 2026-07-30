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

/**
 * @openapi
 * /borrow-records:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow Records]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowBookInput'
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Validation error or out of stock / inactive member
 *   get:
 *     summary: Get all borrow records with filtering
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: memberId
 *         schema: { type: string }
 *       - in: query
 *         name: bookId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [borrowed, returned, overdue] }
 *     responses:
 *       200:
 *         description: List of borrow records retrieved successfully
 */
router
  .route('/')
  .post(borrowBookValidator, validate, borrowBook)
  .get(queryBorrowRecordValidator, validate, getAllBorrowRecords);

/**
 * @openapi
 * /borrow-records/{id}/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow Records]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Book returned successfully and fine calculated if overdue
 *       400:
 *         description: Book already returned or invalid ID
 *       404:
 *         description: Borrow record not found
 */
router
  .route('/:id/return')
  .post(returnBookValidator, validate, returnBook);

/**
 * @openapi
 * /borrow-records/{id}:
 *   get:
 *     summary: Get borrow record by ID
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Borrow record details
 *       404:
 *         description: Record not found
 *   delete:
 *     summary: Delete borrow record by ID
 *     tags: [Borrow Records]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */
router
  .route('/:id')
  .get(getBorrowRecordByIdValidator, validate, getBorrowRecordById)
  .delete(getBorrowRecordByIdValidator, validate, deleteBorrowRecord);

module.exports = router;
