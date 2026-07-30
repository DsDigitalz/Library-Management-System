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

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Book created successfully }
 *                 data: { $ref: '#/components/schemas/Book' }
 *       400:
 *         description: Validation or duplicate ISBN error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   get:
 *     summary: Get all books with pagination, search, and filtering
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search query for title, author, or ISBN
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *         description: Filter by genre
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [available, maintenance, out_of_stock] }
 *         description: Filter by availability status
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 */
router
  .route('/')
  .post(createBookValidator, validate, createBook)
  .get(queryBookValidator, validate, getAllBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ID of the book
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *       404:
 *         description: Book not found
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ID of the book
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router
  .route('/:id')
  .get(getBookByIdValidator, validate, getBookById)
  .put(updateBookValidator, validate, updateBook)
  .delete(getBookByIdValidator, validate, deleteBook);

module.exports = router;
