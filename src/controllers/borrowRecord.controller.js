const BorrowRecord = require('../models/borrowRecord.model');
const Book = require('../models/book.model');
const Member = require('../models/member.model');
const ApiError = require('../utils/ApiError');

// Issue a book to a member (Borrow Book)
const borrowBook = async (req, res, next) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    if (book.availableCopies <= 0 || book.status !== 'available') {
      throw new ApiError(400, 'Book is currently out of stock or unavailable for borrowing');
    }

    const member = await Member.findById(memberId);
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    if (member.status !== 'active') {
      throw new ApiError(400, `Member account is ${member.status}. Only active members can borrow books.`);
    }

    // Check if member already has an unreturned copy of this book
    const existingActiveBorrow = await BorrowRecord.findOne({
      book: bookId,
      member: memberId,
      status: { $in: ['borrowed', 'overdue'] },
    });

    if (existingActiveBorrow) {
      throw new ApiError(400, 'Member already has an active borrow record for this book');
    }

    // Set default due date to 14 days from now if not provided
    const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const borrowRecord = await BorrowRecord.create({
      book: bookId,
      member: memberId,
      borrowDate: new Date(),
      dueDate: calculatedDueDate,
      status: 'borrowed',
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    await borrowRecord.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'member', select: 'name email phone' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Process returning a borrowed book
const returnBook = async (req, res, next) => {
  try {
    const borrowRecord = await BorrowRecord.findById(req.params.id);
    if (!borrowRecord) {
      throw new ApiError(404, 'Borrow record not found');
    }

    if (borrowRecord.status === 'returned') {
      throw new ApiError(400, 'Book has already been returned for this record');
    }

    const returnDate = new Date();
    let fineAmount = 0;

    // Fine calculation: $1 per day overdue
    if (returnDate > borrowRecord.dueDate) {
      const overdueTime = returnDate.getTime() - new Date(borrowRecord.dueDate).getTime();
      const overdueDays = Math.ceil(overdueTime / (1000 * 3600 * 24));
      fineAmount = overdueDays * 1;
    }

    borrowRecord.returnDate = returnDate;
    borrowRecord.status = 'returned';
    borrowRecord.fineAmount = fineAmount;
    await borrowRecord.save();

    // Increment available copies for the book
    const book = await Book.findById(borrowRecord.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    await borrowRecord.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'member', select: 'name email phone' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: borrowRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get all borrow records with filtering and pagination
const getAllBorrowRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { memberId, bookId, status } = req.query;
    const filter = {};

    if (memberId) {
      filter.member = memberId;
    }

    if (bookId) {
      filter.book = bookId;
    }

    if (status) {
      filter.status = status;
    }

    const [records, total] = await Promise.all([
      BorrowRecord.find(filter)
        .populate('book', 'title author isbn genre')
        .populate('member', 'name email phone membershipType')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      BorrowRecord.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: records,
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

// Get single borrow record by ID
const getBorrowRecordById = async (req, res, next) => {
  try {
    const record = await BorrowRecord.findById(req.params.id)
      .populate('book', 'title author isbn genre')
      .populate('member', 'name email phone membershipType');

    if (!record) {
      throw new ApiError(404, 'Borrow record not found');
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// Delete borrow record (Admin operation)
const deleteBorrowRecord = async (req, res, next) => {
  try {
    const record = await BorrowRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      throw new ApiError(404, 'Borrow record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Borrow record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getAllBorrowRecords,
  getBorrowRecordById,
  deleteBorrowRecord,
};
