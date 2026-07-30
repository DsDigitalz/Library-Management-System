const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const bookRoutes = require('./routes/book.routes');
const memberRoutes = require('./routes/member.routes');
const borrowRecordRoutes = require('./routes/borrowRecord.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger UI Documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Library Management System API is running smoothly',
    timestamp: new Date().toISOString(),
    documentation: '/api-docs',
  });
});

// API routes
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/borrow-records', borrowRecordRoutes);

// Fallback & error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
