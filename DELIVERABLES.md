# Project Deliverables - Library Management System API

## 📌 Project Links & Live Resources

| Resource | Link / URL |
| :--- | :--- |
| **GitHub Repository** | [https://github.com/DsDigitalz/Library-Management-System](https://github.com/DsDigitalz/Library-Management-System) |

| **Interactive API Documentation (Swagger)** | [https://library-management-api-xaum.onrender.com/api-docs/](https://library-management-api-xaum.onrender.com/api-docs/) |

---

## 📋 Deliverables Summary Checklist

- [x] **Working REST API supporting all required CRUD operations**: Full support for Books, Members, and Borrowing Records with relational constraints, automatic stock tracking, and overdue fine logic.
- [x] **Complete API documentation containing**:
  - Endpoint list
  - HTTP methods
  - Request body examples
  - Response examples
  - Error responses where applicable
- [x] **Data model documentation**: Collections, document relationships, and schema design decisions documented in the section below.
- [x] **GitHub repository with a complete README and meaningful commit history**: Semantic git commit history (`feat`, `fix`, `docs`, `test`) and production setup guides in `README.md`.

---

## 🗄️ Data Model Documentation

### Collections

The API uses three MongoDB collections managed via Mongoose ODM:

| Collection | Mongoose Model | Purpose |
| :--- | :--- | :--- |
| `books` | `Book` | Stores all library book records including stock levels and availability status |
| `members` | `Member` | Stores library member profiles and membership details |
| `borrowrecords` | `BorrowRecord` | Tracks every borrow/return transaction linking a member to a book |

---

### Document Relationships

The data model uses a **referencing (normalised) approach** for cross-collection relationships rather than embedding. This is the recommended NoSQL pattern when the referenced documents are large, frequently updated independently, or queried standalone.

```
Member (1) ──────< BorrowRecord (N) >────── Book (1)
```

- A **Member** can have many **BorrowRecords** (one-to-many).
- A **Book** can appear in many **BorrowRecords** (one-to-many).
- A **BorrowRecord** always references exactly one `Member` and one `Book` via `ObjectId` fields.
- Mongoose `.populate()` is used at query time to hydrate references into full sub-documents in API responses.

---

### Schema Design Decisions

#### Books Collection
- **`isbn` is unique** — enforced at both schema level (`unique: true`) and application level (pre-create duplicate check) to guarantee catalogue integrity.
- **`totalCopies` vs `availableCopies`** — tracked as separate fields to allow concurrent borrow tracking without scanning all records. `availableCopies` is atomically decremented/incremented on each borrow/return.
- **`status` is auto-managed** — a Mongoose pre-save hook automatically sets `status` to `out_of_stock` when `availableCopies` reaches 0 and restores it to `available` when copies are returned. The `maintenance` status can only be set manually via a PUT request.
- **No `summary` field** — the Book schema does not include a `summary` field by design; the core catalogue fields (title, author, ISBN, genre, year, copies, status) are sufficient for library management operations. This keeps documents lean and queries fast.

#### Members Collection
- **`email` is unique** — prevents duplicate registrations and doubles as a natural identifier for member lookup.
- **`membershipType` enum** (`standard` | `premium` | `student`) — enforced at schema level. Extensible by adding values to the enum without changing the document structure.
- **`status` enum** (`active` | `inactive` | `suspended`) — drives borrow eligibility. Only `active` members are permitted to borrow books; this check is enforced in the `borrowBook` controller.
- **`joinedDate` defaults to `Date.now`** — automatically recorded on creation; distinct from Mongoose `createdAt` timestamp.

#### BorrowRecords Collection
- **References over embedding** — `book` and `member` are stored as `ObjectId` references rather than embedded documents. This avoids data duplication and allows book/member data to be updated independently without migrating borrow records.
- **No `PUT /borrow-records/:id` route (intentional)** — borrow records are immutable transaction logs. The only permitted state transition is returning a book, which is handled by the dedicated `POST /borrow-records/:id/return` action endpoint. This preserves audit trail integrity.
- **`status` enum** (`borrowed` | `returned` | `overdue`) — `overdue` is a valid document state but is **not automatically applied by a background job**. The `overdue` status can be set manually or via a future scheduled task. Fine calculation (`$1/day`) is performed at return time by comparing `returnDate` against `dueDate`, regardless of the stored `status` value. This avoids the need for periodic database scans in the current implementation.
- **`fineAmount` defaults to 0** — only populated with a non-zero value when a book is returned after its `dueDate`.
- **`borrowDate` is recorded server-side** — not accepted from the client to prevent backdating.

---

## 📖 Complete API Documentation

### Base URLs
- **Local Environment**: `http://localhost:5000/api/v1`
- **Production Environment**: `https://library-management-system-api.onrender.com/api/v1`

---

### 1. Health Check Endpoint

#### `GET /health`
Verifies that the API service is active and connected.

- **Method**: `GET`
- **Request Body**: None
- **Response (200 OK)**:
```json
{
  "status": "OK",
  "message": "Library Management System API is running smoothly",
  "timestamp": "2026-07-30T20:50:00.000Z",
  "documentation": "/api-docs"
}
```

---

### 2. Books API (`/api/v1/books`)

#### `POST /api/v1/books` — Create a New Book
Registers a new book in the library catalog.

- **Method**: `POST`
- **Request Body Example**:
```json
{
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "publishedYear": 2008,
  "genre": "Software Engineering",
  "totalCopies": 5,
  "availableCopies": 5
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "66a93b4f1234567890abcdef",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008,
    "genre": "Software Engineering",
    "totalCopies": 5,
    "availableCopies": 5,
    "status": "available",
    "createdAt": "2026-07-30T20:00:00.000Z",
    "updatedAt": "2026-07-30T20:00:00.000Z"
  }
}
```
- **Error Response (400 Bad Request — Validation Failed)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "isbn",
      "message": "A book with this ISBN already exists"
    }
  ]
}
```

---

#### `GET /api/v1/books` — Get All Books
Retrieves a paginated list of books with search and filter capabilities.

- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional, default: `1`): Page number.
  - `limit` (optional, default: `10`): Number of items per page.
  - `search` (optional): Filter by title, author, or ISBN.
  - `genre` (optional): Filter by genre name.
  - `status` (optional): `available` | `maintenance` | `out_of_stock`.
- **Request Body**: None
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "66a93b4f1234567890abcdef",
      "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "publishedYear": 2008,
      "genre": "Software Engineering",
      "totalCopies": 5,
      "availableCopies": 5,
      "status": "available",
      "createdAt": "2026-07-30T20:00:00.000Z",
      "updatedAt": "2026-07-30T20:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

#### `GET /api/v1/books/:id` — Get Single Book
Retrieves detailed information for a specific book by its MongoDB ID.

- **Method**: `GET`
- **Path Parameter**: `id` (e.g. `66a93b4f1234567890abcdef`)
- **Request Body**: None
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "66a93b4f1234567890abcdef",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008,
    "genre": "Software Engineering",
    "totalCopies": 5,
    "availableCopies": 5,
    "status": "available",
    "createdAt": "2026-07-30T20:00:00.000Z",
    "updatedAt": "2026-07-30T20:00:00.000Z"
  }
}
```
- **Error Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Book not found with ID: 66a93b4f1234567890abcdef"
}
```

---

#### `PUT /api/v1/books/:id` — Update Book
Modifies details of an existing book.

- **Method**: `PUT`
- **Path Parameter**: `id`
- **Request Body Example**:
```json
{
  "totalCopies": 10,
  "availableCopies": 10,
  "status": "available"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "66a93b4f1234567890abcdef",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008,
    "genre": "Software Engineering",
    "totalCopies": 10,
    "availableCopies": 10,
    "status": "available",
    "updatedAt": "2026-07-30T20:10:00.000Z"
  }
}
```

---

#### `DELETE /api/v1/books/:id` — Delete Book
Deletes a book record from the system catalog.

- **Method**: `DELETE`
- **Path Parameter**: `id`
- **Request Body**: None
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

### 3. Members API (`/api/v1/members`)

#### `POST /api/v1/members` — Register New Member
Creates a new library member profile.

- **Method**: `POST`
- **Request Body Example**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1234567890",
  "membershipType": "standard"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "_id": "66a93c121234567890fedcba",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1234567890",
    "membershipType": "standard",
    "status": "active",
    "membershipDate": "2026-07-30T20:00:00.000Z",
    "createdAt": "2026-07-30T20:00:00.000Z",
    "updatedAt": "2026-07-30T20:00:00.000Z"
  }
}
```
- **Error Response (400 Bad Request — Duplicate Email)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "A member with this email already exists"
    }
  ]
}
```

---

#### `GET /api/v1/members` — Get All Members
Retrieves a paginated list of library members.

- **Method**: `GET`
- **Query Parameters**: `page`, `limit`, `search`, `membershipType`, `status`
- **Request Body**: None
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Members retrieved successfully",
  "data": [
    {
      "_id": "66a93c121234567890fedcba",
      "fullName": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1234567890",
      "membershipType": "standard",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

#### `GET /api/v1/members/:id` — Get Single Member
- **Method**: `GET`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Member details retrieved successfully",
  "data": {
    "_id": "66a93c121234567890fedcba",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1234567890",
    "membershipType": "standard",
    "status": "active"
  }
}
```

---

#### `PUT /api/v1/members/:id` — Update Member
- **Method**: `PUT`
- **Request Body Example**:
```json
{
  "membershipType": "premium",
  "phone": "+1987654321"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Member updated successfully",
  "data": {
    "_id": "66a93c121234567890fedcba",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1987654321",
    "membershipType": "premium",
    "status": "active"
  }
}
```

---

#### `DELETE /api/v1/members/:id` — Delete Member
- **Method**: `DELETE`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

---

### 4. Borrow Records API (`/api/v1/borrow-records`)

#### `POST /api/v1/borrow-records` — Borrow a Book
Processes a book loan for an active member. Automatically decrements `availableCopies` for the book.

- **Method**: `POST`
- **Request Body Example**:
```json
{
  "memberId": "66a93c121234567890fedcba",
  "bookId": "66a93b4f1234567890abcdef",
  "dueDate": "2026-08-14T20:00:00.000Z"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "66a93d991234567890112233",
    "member": "66a93c121234567890fedcba",
    "book": "66a93b4f1234567890abcdef",
    "borrowDate": "2026-07-30T20:00:00.000Z",
    "dueDate": "2026-08-14T20:00:00.000Z",
    "returnDate": null,
    "status": "borrowed",
    "fineAmount": 0
  }
}
```
- **Error Response (400 Bad Request — Book Out of Stock)**:
```json
{
  "success": false,
  "message": "Book is currently out of stock and unavailable for borrowing"
}
```

---

#### `POST /api/v1/borrow-records/:id/return` — Return a Borrowed Book
Processes the return of a borrowed book. Restores `availableCopies` and calculates any overdue fines ($1/day past due date).

- **Method**: `POST`
- **Path Parameter**: `id` (Borrow Record ID)
- **Request Body**: None
- **Success Response (200 OK — Returned on Time)**:
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "_id": "66a93d991234567890112233",
    "borrowDate": "2026-07-30T20:00:00.000Z",
    "dueDate": "2026-08-14T20:00:00.000Z",
    "returnDate": "2026-08-10T12:00:00.000Z",
    "status": "returned",
    "fineAmount": 0
  }
}
```
- **Success Response (200 OK — Overdue Fine Applied)**:
```json
{
  "success": true,
  "message": "Book returned successfully. Overdue fine applied: $5",
  "data": {
    "_id": "66a93d991234567890112233",
    "status": "returned",
    "returnDate": "2026-08-19T20:00:00.000Z",
    "fineAmount": 5
  }
}
```

---

#### `GET /api/v1/borrow-records` — List Borrow Records
- **Method**: `GET`
- **Query Parameters**: `page`, `limit`, `memberId`, `bookId`, `status` (`borrowed` | `returned` | `overdue`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Borrow records retrieved successfully",
  "data": [
    {
      "_id": "66a93d991234567890112233",
      "member": {
        "_id": "66a93c121234567890fedcba",
        "fullName": "Jane Doe",
        "email": "jane.doe@example.com"
      },
      "book": {
        "_id": "66a93b4f1234567890abcdef",
        "title": "Clean Code",
        "author": "Robert C. Martin"
      },
      "borrowDate": "2026-07-30T20:00:00.000Z",
      "dueDate": "2026-08-14T20:00:00.000Z",
      "status": "borrowed",
      "fineAmount": 0
    }
  ]
}
```

---

#### `DELETE /api/v1/borrow-records/:id` — Delete Borrow Record
- **Method**: `DELETE`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Borrow record deleted successfully"
}
```

---

## 🛠️ Common Error Handling Matrix

All endpoints follow standard HTTP status codes and a consistent JSON response structure:

| HTTP Status Code | Scenario | Example Response Body |
| :--- | :--- | :--- |
| **400 Bad Request** | Request validation fails or duplicate unique field (e.g. ISBN/Email). | `{"success": false, "message": "Validation failed", "errors": [{"field": "email", "message": "Email is required"}]}` |
| **404 Not Found** | Resource ID does not exist in the database or invalid route endpoint. | `{"success": false, "message": "Resource not found"}` |
| **409 Conflict** | Action conflicts with current state (e.g., book already returned). | `{"success": false, "message": "Book has already been returned"}` |
| **500 Internal Server Error** | Unexpected server or database exception. | `{"success": false, "message": "Internal server error"}` |

---

## 🐙 Git Repository & Commit History

### Repository Information
- **Remote Origin**: `https://github.com/DsDigitalz/Library-Management-System.git`
- **Default Branch**: `master`

### Meaningful Commit History Log
```txt
* c2ba8a9 (HEAD -> master, origin/master) feat: enhance Swagger UI with OpenAPI route annotations, CORS headers, security schemes, and persistent auth
* 00f61a8 fix: guard dotenv to only load in non-production environments
* 9b12005 feat: complete Library Management System API with Swagger, validators and error handling
* 9520fda feat: Scaffolded project and installed project dependencies
```
