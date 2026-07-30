const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    publishedYear: {
      type: Number,
      required: [true, 'Published year is required'],
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies count is required'],
      min: [0, 'Total copies cannot be negative'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies count is required'],
      min: [0, 'Available copies cannot be negative'],
      default: 1,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'out_of_stock'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Automatically set status based on available copies before saving
bookSchema.pre('save', async function () {
  if (this.availableCopies === 0 && this.status !== 'maintenance') {
    this.status = 'out_of_stock';
  } else if (this.availableCopies > 0 && this.status === 'out_of_stock') {
    this.status = 'available';
  }
});

module.exports = mongoose.model('Book', bookSchema);
