const request = require('supertest');
const app = require('../src/app');
const Book = require('../src/models/book.model');

jest.mock('../src/models/book.model');

describe('Book API Endpoints Validation & Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/books', () => {
    it('should reject invalid payloads with 400 Validation Failed', async () => {
      const res = await request(app).post('/api/v1/books').send({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        publishedYear: 99,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('Validation Failed');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should create a book successfully when payload is valid', async () => {
      const bookData = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        genre: 'Software Engineering',
        publishedYear: 2008,
        totalCopies: 5,
        availableCopies: 5,
      };

      Book.findOne.mockResolvedValue(null);
      Book.create.mockResolvedValue({
        _id: '60d5ecb8b5c9c22b9c8b4567',
        ...bookData,
        status: 'available',
      });

      const res = await request(app).post('/api/v1/books').send(bookData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toEqual('Clean Code');
    });
  });

  describe('GET /api/v1/books/:id', () => {
    it('should return 400 for invalid Mongo ID format', async () => {
      const res = await request(app).get('/api/v1/books/invalid-id');
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 if book is not found', async () => {
      Book.findById.mockResolvedValue(null);
      const res = await request(app).get('/api/v1/books/60d5ecb8b5c9c22b9c8b4567');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Book not found');
    });
  });
});
