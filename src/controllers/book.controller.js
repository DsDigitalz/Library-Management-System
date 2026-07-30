const Book = require('../models/book.model');
const ApiError = require('../utils/ApiError');

// Create a new book
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, publishedYear, totalCopies, availableCopies } = req.body;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      throw new ApiError(400, 'Book with this ISBN already exists');
    }

    const initialTotalCopies = totalCopies !== undefined ? Number(totalCopies) : 1;
    const initialAvailableCopies = availableCopies !== undefined ? Number(availableCopies) : initialTotalCopies;

    if (initialAvailableCopies > initialTotalCopies) {
      throw new ApiError(400, 'Available copies cannot exceed total copies');
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      publishedYear,
      totalCopies: initialTotalCopies,
      availableCopies: initialAvailableCopies,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Get all books with pagination, search, and filtering
const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, genre, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre) {
      filter.genre = { $regex: `^${genre}$`, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Update book by ID
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    const { isbn, totalCopies, availableCopies } = req.body;

    if (isbn && isbn !== book.isbn) {
      const existingIsbn = await Book.findOne({ isbn });
      if (existingIsbn) {
        throw new ApiError(400, 'Book with this ISBN already exists');
      }
    }

    const newTotal = totalCopies !== undefined ? Number(totalCopies) : book.totalCopies;
    const newAvailable = availableCopies !== undefined ? Number(availableCopies) : book.availableCopies;

    if (newAvailable > newTotal) {
      throw new ApiError(400, 'Available copies cannot exceed total copies');
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Delete book by ID
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
