# WorkflowX — Employee Task & Project Management System

WorkflowX is a full-stack Employee, Task and Project Management System built using **Java, Spring Boot, React, MySQL, JWT Security and Docker**.

The system provides REST APIs and a React-based web interface for managing users, employees, projects and tasks with authentication, role-based authorization, validation, exception handling, database integration and containerized deployment.

---

## 📌 Project Overview

WorkflowX is designed to provide a centralized system for managing employees, projects and tasks.

The application follows a layered backend architecture using Spring Boot and provides a React frontend for interacting with the backend APIs.

### Main capabilities

* User authentication using JWT
* Role-based authorization
* User management
* Employee management
* Project management
* Task management
* Request validation
* Global exception handling
* RESTful APIs
* Swagger/OpenAPI documentation
* MySQL database integration
* Docker containerization
* Automated backend testing
* JaCoCo code coverage

---

## ✨ Features

### 🔐 Authentication & Security

* User login with username and password
* JWT-based authentication
* JWT token generation and validation
* Bearer token authentication
* BCrypt password encoding
* Role-based authorization
* Protected REST APIs
* Admin-only user management
* Unauthorized and forbidden request handling
* CORS configuration for frontend-backend communication

### 👤 User Management

Administrators can manage WorkflowX users.

Supported operations:

* Create user
* View all users
* View user by ID
* Update user
* Delete user

User passwords are not returned in API responses.

### 👨‍💼 Employee Management

The system provides employee management functionality including:

* Employee name
* Email
* Phone
* Department
* Designation
* Associated user account

Supported operations:

* Create employee
* View all employees
* View employee by ID
* Update employee
* Delete employee

### 📁 Project Management

Projects can be created and managed with:

* Project name
* Description
* Start date
* End date
* Status
* Project manager

Supported operations:

* Create project
* View all projects
* View project by ID
* Update project
* Delete project

### ✅ Task Management

Tasks are associated with projects and employees.

Task information includes:

* Title
* Description
* Priority
* Status
* Due date
* Project
* Assigned employee

Supported operations:

* Create task
* View all tasks
* View task by ID
* Update task
* Delete task

### 🛡️ Validation & Exception Handling

WorkflowX includes centralized error handling for:

* Resource not found
* Validation failures
* Malformed JSON requests
* Invalid path parameters
* Invalid request data

API errors are returned using a consistent error-response structure.

---

# 🏗️ System Architecture

WorkflowX follows a layered architecture.

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │      Controllers     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Services       │
                         │   Business Logic     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Repositories      │
                         │   Spring Data JPA    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       MySQL          │
                         │      Database        │
                         └──────────────────────┘

                    JWT Authentication
                           ↓
                 Spring Security Filter
```

---

# 🛠️ Technology Stack

## Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT
* Hibernate
* Maven
* MySQL

## Frontend

* React
* JavaScript
* Vite
* HTML
* CSS

## API Documentation

* Swagger UI
* OpenAPI

## Testing

* JUnit 5
* Spring Boot Test
* Mockito
* MockMvc
* JaCoCo

## DevOps / Deployment

* Docker
* Docker Compose
* Dockerized MySQL

---

# 📂 Project Structure

```text
workflowx/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── dhiraj/
│   │   │           └── workflowx/
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── dto/
│   │   │               ├── entity/
│   │   │               ├── exception/
│   │   │               ├── mapper/
│   │   │               ├── repository/
│   │   │               ├── security/
│   │   │               └── service/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── dhiraj/
│                   └── workflowx/
│                       ├── controller/
│                       ├── integration/
│                       ├── repository/
│                       ├── security/
│                       └── service/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── pom.xml
└── README.md
```

---

# 🔑 Authentication & Authorization

WorkflowX uses **Spring Security and JWT** for authentication.

### Login flow

```text
User
  │
  │ username + password
  ▼
POST /api/auth/login
  │
  ▼
Spring Security
  │
  ▼
JWT Token
  │
  ▼
Frontend stores token
  │
  ▼
Authorization: Bearer <JWT>
  │
  ▼
Protected API
```

JWT tokens contain authentication information including the user's username and role.

Protected requests require a valid JWT token.

---

# 📚 API Documentation

WorkflowX provides interactive API documentation using Swagger UI.

When the backend is running locally, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI specification:

```text
http://localhost:8080/v3/api-docs
```

Swagger provides documentation for:

* Authentication APIs
* User APIs
* Employee APIs
* Project APIs
* Task APIs

Protected endpoints can be tested by authorizing Swagger with a valid JWT Bearer token.

---

# 🌐 Main API Endpoints

## Authentication

```text
POST /api/auth/login
```

## Users

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

## Employees

```text
GET    /api/employees
GET    /api/employees/{id}
POST   /api/employees
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

## Projects

```text
GET    /api/projects
GET    /api/projects/{id}
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

## Tasks

```text
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

---

# 🗄️ Database

WorkflowX uses **MySQL 8.0**.

Main domain entities include:

```text
User
Employee
Project
Task
```

Entity relationships are managed using **JPA/Hibernate**.

The application uses Spring Data JPA repositories for database operations.

---

# 💻 Running WorkflowX Locally

## Prerequisites

Install the following:

* Java 17
* Maven
* Node.js
* npm
* MySQL 8.0
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/dhirajchandgude99-afk/WorkFlowX-Employee-Task-Project-Management.git
```

```bash
cd WorkFlowX-Employee-Task-Project-Management
```

---

## 2. Configure backend environment variables

Create a `.env` file for local configuration.

Example:

```env
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRATION=3600000
```

Do not commit `.env` to GitHub.

---

## 3. Configure frontend

The frontend uses:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The browser communicates with the backend through `localhost:8080`.

---

## 4. Start the backend

From the project root:

```bash
mvn spring-boot:run
```

The backend starts on:

```text
http://localhost:8080
```

---

## 5. Start the frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🐳 Running WorkflowX with Docker

WorkflowX supports Docker Compose for running the complete application stack.

The Docker environment contains:

```text
React Frontend
      │
      ▼
Spring Boot Backend
      │
      ▼
MySQL 8.0
```

---

## Docker services

| Service  | Container          | Port        |
| -------- | ------------------ | ----------- |
| Frontend | workflowx-frontend | 5173        |
| Backend  | workflowx-backend  | 8080        |
| MySQL    | workflowx-mysql    | 3307 → 3306 |

---

## 1. Build the backend

Create the backend JAR:

```bash
mvn clean package
```

---

## 2. Build Docker images

Backend:

```bash
docker build -t workflowx-backend:latest .
```

Frontend:

```bash
docker build -t workflowx-frontend:latest ./frontend
```

---

## 3. Start the Docker environment

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Expected services:

```text
workflowx-backend
workflowx-frontend
workflowx-mysql
```

MySQL should show a healthy status.

---

## 4. Access the application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## 5. Stop the Docker environment

```bash
docker compose down
```

The MySQL named volume is intentionally preserved when using the normal `docker compose down` command.

---

# 🧪 Testing

WorkflowX includes automated backend tests using:

* JUnit 5
* Spring Boot Test
* Mockito
* MockMvc
* Integration tests
* Security tests
* Repository tests
* Controller tests
* Service tests

The project includes tests covering:

* Service logic
* Repository operations
* REST controllers
* JWT/security behavior
* Validation
* Exception handling
* CRUD integration
* Important application scenarios

Run the complete test suite:

```bash
mvn clean test
```

Run the complete Maven verification:

```bash
mvn clean verify
```

---

# 📊 Code Coverage

JaCoCo is configured for code coverage analysis.

The project reached approximately:

| Area          | Coverage |
| ------------- | -------: |
| Overall       |      85% |
| Service       |      98% |
| Mapper        |      93% |
| Entity        |     100% |
| Configuration |     100% |

The latest verified test suite contains:

```text
88 tests
0 failures
0 errors
0 skipped
```

JaCoCo reports are generated as part of the Maven build.

---

# 🔄 Development Workflow

The project was developed using a structured development process:

```text
Requirement
    ↓
Project Design
    ↓
Backend Development
    ↓
Database Integration
    ↓
JWT Security
    ↓
React Frontend
    ↓
Docker
    ↓
Automated Testing
    ↓
Code Coverage
    ↓
Integration Review
    ↓
Project Polish
```

---

# 🔒 Security Considerations

The project follows several security practices:

* Passwords are stored using BCrypt hashing.
* JWT is used for stateless authentication.
* Protected APIs require authentication.
* Role-based authorization is implemented.
* User passwords are excluded from API responses.
* `.env` is excluded from Git tracking.
* Docker environment variables are used for runtime configuration.
* CORS is configured for frontend-backend communication.

For production deployment, secrets should always be supplied through secure environment or secret-management systems rather than committed to source control.

---

# 📸 Screenshots

Screenshots of the WorkflowX application can be added here.

Recommended screenshots:

1. Login page
2. Dashboard
3. Employee management
4. Project management
5. Task management
6. User management
7. Swagger UI
8. Docker containers

Example:

## Login

*Add login screenshot here*

## Dashboard

*Add dashboard screenshot here*

## Employee Management

*Add employee screenshot here*

## Project Management

*Add project screenshot here*

## Task Management

*Add task screenshot here*

## Swagger API Documentation

*Add Swagger screenshot here*

---

# 🚀 Future Improvements

Possible future improvements include:

* Advanced dashboard analytics
* Pagination and filtering
* Search functionality
* More detailed role and permission management
* Email notifications
* File/document attachments
* Production deployment
* CI/CD pipeline
* Kubernetes deployment
* Cloud hosting
* Advanced monitoring and logging

---

# 📌 Project Highlights

WorkflowX demonstrates practical experience with:

* Java backend development
* Spring Boot REST API development
* Spring Data JPA
* MySQL database integration
* Spring Security
* JWT authentication
* Role-based authorization
* React frontend development
* REST API integration
* Docker containerization
* Docker Compose
* Unit testing
* Integration testing
* API testing
* Code coverage
* Swagger/OpenAPI
* Git and GitHub

---

# 👨‍💻 Author

**Dhiraj Sudhakar Chandgude**

Computer Science — Full Stack Java Developer

### Technologies

```text
Java
Spring Boot
Spring Security
JWT
React
JavaScript
MySQL
Docker
Git
GitHub
```

---

# 📄 License

This project is developed for educational, learning and portfolio purposes.
