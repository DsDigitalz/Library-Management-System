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
// Disable CSP in Helmet to allow Swagger UI inline assets to load cleanly
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Configure CORS to support Swagger UI "Try it out" and external clients
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-API-KEY'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger UI Documentation route with persistent authorization and custom title
const swaggerUiOptions = {
  customSiteTitle: 'Library Management System API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

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
