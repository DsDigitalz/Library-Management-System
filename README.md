# Library Management System API

A robust, production-ready RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for managing library operations including Books, Members, and Borrowing Records.

---

## 🌟 Key Features

- **Interactive Swagger Documentation**: Visual UI at `http://localhost:5000/api-docs`.
- **Pre-configured Postman Collection**: Ready-to-import `Library_Management_System_API.postman_collection.json`.
- **MVC Architecture**: Clean separation across Models, Controllers, Routes, Middleware, and Validators.
- **RESTful Endpoints**: Full CRUD for Books, Members, and Borrowing Records.
- **Request Validation**: Schema-driven request checks using `express-validator`.
- **Centralized Error Handling**: Custom `ApiError` class for standard error status codes and field error arrays.
- **Stock Management & Overdue Fines**: Auto-tracking of available book stock and late return fine calculations ($1/day).

---

## 🚀 Interactive Visual API Docs (Swagger UI)

Start the server (`npm run dev`) and visit:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

You can test all endpoints interactively directly inside your browser!

---

## 📁 Project Structure

```
library-management-api/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection setup
│   │   └── swagger.js            # Swagger OpenAPI configuration
│   ├── models/
│   │   ├── book.model.js         # Mongoose schema for Books
│   │   ├── member.model.js       # Mongoose schema for Members
│   │   └── borrowRecord.model.js # Mongoose schema for Borrow Records
│   ├── controllers/
│   │   ├── book.controller.js    # Business logic & request handling for Books
│   │   ├── member.controller.js  # Business logic & request handling for Members
│   │   └── borrowRecord.controller.js # Logic for borrowing/returning books
│   ├── routes/
│   │   ├── book.routes.js        # Express routes for /api/v1/books
│   │   ├── member.routes.js      # Express routes for /api/v1/members
│   │   └── borrowRecord.routes.js# Express routes for /api/v1/borrow-records
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized error handler
│   │   ├── validate.js           # express-validator checker
│   │   └── notFound.js           # 404 handler
│   ├── validators/
│   │   ├── book.validator.js     # Express validation rules for Books
│   │   ├── member.validator.js   # Express validation rules for Members
│   │   └── borrowRecord.validator.js # Express validation rules for Borrow Records
│   ├── utils/
│   │   └── ApiError.js           # Custom error class
│   ├── app.js                    # Express app initialization
│   └── server.js               # DB connection and HTTP listener
├── tests/
│   ├── app.test.js               # Core app & health check tests
│   ├── book.test.js              # Book endpoints tests
│   └── member.test.js            # Member endpoints tests
├── Library_Management_System_API.postman_collection.json # Postman 1-click import
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or via MongoDB Atlas connection string)

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm test
   ```
