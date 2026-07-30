const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'A production-ready RESTful API for managing Books, Members, and Borrowing Records.',
      contact: {
        name: 'API Support Team',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current Environment Relative Base Path',
      },
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Bearer token in the format: Bearer <token>',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-KEY',
          description: 'API Key authentication header',
        },
      },
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'genre', 'publishedYear'],
          properties: {
            _id: { type: 'string', example: '60d5ecb8b5c9c22b9c8b4567' },
            title: { type: 'string', example: 'Clean Architecture' },
            author: { type: 'string', example: 'Robert C. Martin' },
            isbn: { type: 'string', example: '9780134494166' },
            genre: { type: 'string', example: 'Software Engineering' },
            publishedYear: { type: 'integer', example: 2017 },
            totalCopies: { type: 'integer', example: 5 },
            availableCopies: { type: 'integer', example: 5 },
            status: { type: 'string', enum: ['available', 'maintenance', 'out_of_stock'], example: 'available' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateBookInput: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'genre', 'publishedYear'],
          properties: {
            title: { type: 'string', example: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design' },
            author: { type: 'string', example: 'Robert C. Martin' },
            isbn: { type: 'string', example: '9780134494166' },
            genre: { type: 'string', example: 'Software Engineering' },
            publishedYear: { type: 'integer', example: 2017 },
            totalCopies: { type: 'integer', example: 5 },
            availableCopies: { type: 'integer', example: 5 },
          },
        },
        UpdateBookInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Clean Architecture (2nd Edition)' },
            author: { type: 'string', example: 'Robert C. Martin' },
            isbn: { type: 'string', example: '9780134494166' },
            genre: { type: 'string', example: 'Software Architecture' },
            publishedYear: { type: 'integer', example: 2018 },
            totalCopies: { type: 'integer', example: 10 },
            availableCopies: { type: 'integer', example: 8 },
            status: { type: 'string', enum: ['available', 'maintenance', 'out_of_stock'], example: 'available' },
          },
        },
        Member: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            _id: { type: 'string', example: '60d5ecb8b5c9c22b9c8b9999' },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'jane.doe@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            membershipType: { type: 'string', enum: ['standard', 'premium', 'student'], example: 'standard' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'], example: 'active' },
            joinedDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateMemberInput: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'jane.doe@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            membershipType: { type: 'string', enum: ['standard', 'premium', 'student'], example: 'standard' },
          },
        },
        UpdateMemberInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe Smith' },
            email: { type: 'string', example: 'jane.smith@example.com' },
            phone: { type: 'string', example: '+1987654321' },
            membershipType: { type: 'string', enum: ['standard', 'premium', 'student'], example: 'premium' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'], example: 'active' },
          },
        },
        BorrowRecord: {
          type: 'object',
          required: ['book', 'member'],
          properties: {
            _id: { type: 'string', example: '60d5ecb8b5c9c22b9c8b1111' },
            book: { type: 'string', example: '60d5ecb8b5c9c22b9c8b4567' },
            member: { type: 'string', example: '60d5ecb8b5c9c22b9c8b9999' },
            borrowDate: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            returnDate: { type: 'string', format: 'date-time', nullable: true },
            status: { type: 'string', enum: ['borrowed', 'returned', 'overdue'], example: 'borrowed' },
            fineAmount: { type: 'number', example: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BorrowBookInput: {
          type: 'object',
          required: ['bookId', 'memberId'],
          properties: {
            bookId: { type: 'string', example: '60d5ecb8b5c9c22b9c8b4567' },
            memberId: { type: 'string', example: '60d5ecb8b5c9c22b9c8b9999' },
            dueDate: { type: 'string', format: 'date-time', example: '2026-08-15T00:00:00.000Z' },
          },
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation Failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'A valid email address is required' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Books', description: 'Book inventory management endpoints' },
      { name: 'Members', description: 'Library member management endpoints' },
      { name: 'Borrow Records', description: 'Book borrowing and return tracking endpoints' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
