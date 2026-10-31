# Task Manager API

A secure RESTful Task Management API built using **Node.js, Express.js, and MongoDB**.

This project provides a backend system for managing personal tasks with user authentication, authorization, task ownership, and advanced task management functionality.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Access and refresh token management with token rotation
- Secure logout functionality
- Role-Based Access Control (RBAC)
- Task CRUD operations
- Task ownership protection
- Input validation using Zod
- Pagination, filtering, sorting, and searching
- Task statistics
- Centralized error handling
- Request body size limiting
- API security improvements
## Technology Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt
- Helmet
- CORS
- Express Rate Limit

### Validation
- Zod

### Development Tools
- Visual Studio Code
- Postman
- Git
- GitHub
## Project Structure

```text
Task-Manager-API/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   └── task.controller.js
│
├── middleware/
│   ├── admin.middleware.js
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── validate.middleware.js
│   └── validateObjectId.middleware.js
│
├── models/
│   ├── task.js
│   └── user.js
│
├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
│   └── task.routes.js
│
├── services/
│   ├── auth.service.js
│   └── task.service.js
│
├── validators/
│   ├── auth.validator.js
│   └── task.validator.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

### Folder Responsibilities

| Folder/File | Responsibility |
|---|---|
| `config/` | Database configuration and connection |
| `controllers/` | Handles incoming requests and responses |
| `middleware/` | Authentication, authorization, and request validation |
| `models/` | MongoDB schemas and models |
| `routes/` | Defines API endpoints |
| `services/` | Contains business logic |
| `validators/` | Defines request validation schemas |
| `server.js` | Application entry point |
| `.env` | Stores environment variables |
| `.gitignore` | Excludes sensitive and unnecessary files |

**Note:** The `.env` file is shown to explain the local project structure. It is excluded from GitHub.
## Installation and Setup

Follow these steps to run the Task Manager API locally.

### 1. Clone the Repository

```bash
git clone https://github.com/bharathyadav-7/Task-Manager-API.git
```

### 2. Navigate to the Project Directory

```bash
cd Task-Manager-API
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

Add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Replace the placeholder values with your actual configuration.

**Important:** Never share or commit your `.env` file or expose your secret keys.

### 5. Start the Server

```bash
node server.js
```

The API should now be running at:

```text
http://localhost:3000
```

### 6. Verify the API

Open the following URL in your browser or API testing tool:

```text
http://localhost:3000/
```

You should receive a response confirming that the Task Manager API is running.
## API Documentation

Base URL:

```text
http://localhost:3000
```

### Authentication Routes

Base path: `/api/auth`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Authenticate user | No |
| POST | `/refresh` | Refresh access token | No |
| POST | `/logout` | Log out user | No |

### Task Routes

Base path: `/api/tasks`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/` | Create a task | Required |
| GET | `/` | Get all user's tasks | Required |
| GET | `/stats` | Get task statistics | Required |
| GET | `/:id` | Get a specific task | Required |
| PATCH | `/:id` | Update a task | Required |
| DELETE | `/:id` | Delete a task | Required |

### Admin Routes

Base path: `/api/admin`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/dashboard` | Access admin dashboard | Admin only |

### Authentication Header

Protected task endpoints require a valid access token.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```
## Request Bodies and Query Parameters

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Create a Task

**Endpoint:** `POST /api/tasks`

```json
{
  "title": "Complete Backend Project",
  "description": "Finish the Task Manager API",
  "priority": "high"
}
```

Available priorities:
- `low`
- `medium`
- `high`

Available task statuses:
- `pending`
- `in-progress`
- `completed`

### 4. Update a Task

**Endpoint:** `PATCH /api/tasks/:id`

```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in-progress",
  "priority": "high"
}
```

All update fields are optional. Only provide the fields you want to change.

### 5. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh`

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### 6. User Logout

**Endpoint:** `POST /api/auth/logout`

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### 7. Task Pagination

**Endpoint:** `GET /api/tasks`

Supported query parameters:

| Parameter | Description | Example |
|---|---|---|
| `page` | Page number | `page=1` |
| `limit` | Number of tasks per page | `limit=10` |
| `status` | Filter by task status | `status=pending` |
| `sort` | Sort tasks | `sort=-createdAt` |
| `search` | Search task title and description | `search=meeting` |

Example:

```http
GET /api/tasks?page=1&limit=10&status=pending&sort=-createdAt&search=meeting
```

The API supports pagination, filtering, sorting, and searching within the authenticated user's tasks.
## Response Examples

### 1. Successful Registration

**Status:** `201 Created`

```json
{
  "message": "User registered successfully"
}
```

### 2. Successful Login

**Status:** `200 OK`

```json
{
  "message": "Login successful",
  "accessToken": "YOUR_ACCESS_TOKEN",
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### 3. Successful Task Creation

**Status:** `201 Created`

```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "TASK_ID",
    "title": "Complete Backend Project",
    "description": "Finish the Task Manager API",
    "status": "pending",
    "priority": "high"
  }
}
```

### 4. Validation Error

**Status:** `400 Bad Request`

```json
{
  "message": "Validation failed",
  "errors": []
}
```

### 5. Authentication Error

**Status:** `401 Unauthorized`

```json
{
  "message": "Authentication required"
}
```

### 6. Resource Not Found

**Status:** `404 Not Found`

```json
{
  "message": "Task not found"
}
```

### 7. Authorization Error

**Status:** `403 Forbidden`

```json
{
  "message": "Access denied. Admins only."
}
```

## HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 413 | Payload Too Large |
| 500 | Internal Server Error |
## Security Features

The Task Manager API implements several security measures to protect user accounts, API endpoints, and task data.

### 1. Password Security
- Passwords are hashed using bcrypt before being stored in MongoDB.
- Plain-text passwords are never stored in the database.

### 2. JWT Authentication
- Access tokens are used to authenticate protected API requests.
- JWT verification middleware validates incoming access tokens.
- Expired or invalid access tokens are rejected.

### 3. Refresh Token Rotation
- Refresh tokens are stored as bcrypt hashes in the database.
- Refresh token rotation replaces the previous refresh token when a new access token is issued.
- Reused or invalid refresh tokens are rejected.
- Logout invalidates the stored refresh token.

### 4. Role-Based Access Control (RBAC)
- The API supports `user` and `admin` roles.
- Admin-only routes are protected by authorization middleware.
- Unauthorized users cannot access admin resources.

### 5. Task Ownership Protection
- Users can access only their own tasks.
- Task queries use both the task ID and authenticated user ID.
- Users cannot update or delete tasks belonging to other users.

### 6. Input Validation
- Zod validates incoming request data.
- Invalid fields and unsupported values are rejected.
- Task updates use an allowlist of permitted fields.

### 7. API Security Middleware
- Helmet adds security-related HTTP headers.
- CORS controls cross-origin requests.
- Express Rate Limit restricts excessive requests.
- JSON request body size is limited to 10 KB.
- Invalid MongoDB ObjectIds are rejected.
- Pagination and search inputs are validated.

### 8. Centralized Error Handling
- A centralized error middleware handles application errors.
- Oversized request bodies return HTTP 413.
- Internal server errors return a generic response instead of exposing implementation details.
## Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

## License

No license has been specified for this project yet.

## Author

**Katuru Bharath**

GitHub: [bharathyadav-7](https://github.com/bharathyadav-7)

Project Repository: [Task Manager API](https://github.com/bharathyadav-7/Task-Manager-API)