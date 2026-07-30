const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'A production-ready RESTful API for managing Books, Members, and Borrowing Records.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local Development Server',
      },
    ],
    components: {
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
          },
        },
        BorrowRecord: {
          type: 'object',
          required: ['bookId', 'memberId'],
          properties: {
            _id: { type: 'string', example: '60d5ecb8b5c9c22b9c8b1111' },
            bookId: { type: 'string', example: '60d5ecb8b5c9c22b9c8b4567' },
            memberId: { type: 'string', example: '60d5ecb8b5c9c22b9c8b9999' },
            borrowDate: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            returnDate: { type: 'string', format: 'date-time', nullable: true },
            status: { type: 'string', enum: ['borrowed', 'returned', 'overdue'], example: 'borrowed' },
            fineAmount: { type: 'number', example: 0 },
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
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
