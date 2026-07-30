if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Library Management System Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception Error: ${err.message}`);
    process.exit(1);
  });
};

startServer();
