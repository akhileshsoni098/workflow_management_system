# Workflow Management System

A **Node.js + Express + MongoDB** based backend API for managing internal company workflows, projects, and tasks.

The system supports **Admin / Manager / Employee roles** with secure **JWT authentication**, project management, and task tracking.

---

# 🚀 Features

- User Authentication (Register & Login)
- Role Based Access (Admin / Manager / Employee)
- Project Creation & Management
- Assign Users to Projects
- Task Creation & Management
- Task Status Tracking
- Pagination & Filtering
- JWT Based Authentication
- RESTful API Architecture

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

# 📌 Base URL

```
http://localhost:3001
```

---

# 🔐 Authentication APIs

## Register User

**POST**

```
/user/register
```

### Request Body

```json
{
  "name": "Employee4",
  "email": "emp4@gmail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "status": true,
  "message": "User registered successfully",
  "userId": "USER_ID"
}
```

---

## Login User

**POST**

```
/user/logIn
```

### Request Body

```json
{
  "email": "emp1@gmail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "status": true,
  "token": "JWT_TOKEN"
}
```

---

# 🔑 Authentication Header

All protected routes require:

```
x-auth-token : JWT_TOKEN
```

---

# 👨‍💼 Admin / Manager APIs

## Get All Users

**GET**

```
/users
```

### Query Parameters

| Parameter | Description          |
| --------- | -------------------- |
| name      | Filter users by name |
| page      | Pagination page      |
| limit     | Number of records    |

Example

```
/users?name=admin&page=1&limit=10
```

---

# 📁 Project APIs

## Create Project

**POST**

```
/projects
```

### Request Body

```json
{
  "name": "Workflow Management System",
  "description": "Project to manage internal company workflows and tasks",
  "assignedUsers": ["69ac50e6b1cb8a23107109d1"]
}
```

---

## Update Project

**PUT**

```
/projects/:projectId
```

Example

```
/projects/69ac55755fbe0db03e5e8a7d
```

### Request Body

```json
{
  "name": "Workflow Management System",
  "description": "Project to manage internal company workflows and tasks",
  "assignedUsers": ["69ac50e6b1cb8a23107109d1", "69ac50f1b1cb8a23107109d4"]
}
```

---

## Get All Projects

**GET**

```
/projects
```

### Query Parameters

| Parameter    | Description             |
| ------------ | ----------------------- |
| name         | Filter by project name  |
| page         | Pagination              |
| limit        | Result limit            |
| assignedUser | Filter by assigned user |

Example

```
/projects?name=workflow&page=1&limit=10&assignedUser=69ac50f1b1cb8a23107109d4
```

---

## Get Single Project

**GET**

```
/projects/:projectId
```

Example

```
/projects/69ac55755fbe0db03e5e8a7d
```

---

## Delete Project

**DELETE**

```
/projects/:projectId
```

Example

```
/projects/69ac55755fbe0db03e5e8a7d
```

---

## Assign Users to Project

**PUT**

```
/projects/assign/:projectId
```

Example

```
/projects/assign/69ac59c19f5a365fa6abc30f
```

### Request Body

```json
{
  "userIds": ["69ac50e6b1cb8a23107109d1"]
}
```

---

# 🗂 Task APIs

## Create Task

**POST**

```
/tasks/:projectId
```

Example

```
/tasks/69ac59c19f5a365fa6abc30f
```

### Request Body

```json
{
  "title": "Create authentication module",
  "description": "Implement JWT based authentication for the project",
  "assignedUser": "69ac50e6b1cb8a23107109d1",
  "priority": "High",
  "status": "Todo",
  "dueDate": "2026-03-09"
}
```

---

## Update Task

**PUT**

```
/tasks/:taskId
```

### Request Body

```json
{
  "title": "Create authentication module",
  "description": "Implement JWT based authentication",
  "assignedUser": "69ac50e6b1cb8a23107109d1",
  "priority": "High",
  "status": "In Progress",
  "dueDate": "2026-03-09"
}
```

---

## Change Task Status

**PUT**

```
/tasks/status/:taskId
```

### Request Body

```json
{
  "status": "Review"
}
```

---

## Get Tasks by Project

**GET**

```
/tasks/:projectId
```

### Query Parameters

| Parameter | Description        |
| --------- | ------------------ |
| status    | Filter by status   |
| priority  | Filter by priority |

Example

```
/tasks/69ac59c19f5a365fa6abc30f?status=Todo&priority=High
```

---

## Delete Task

**DELETE**

```
/tasks/:taskId
```

---

# 👨‍💻 Employee APIs

## Get Assigned Projects

**GET**

```
/employee/projects
```

### Query Parameters

| Parameter | Description      |
| --------- | ---------------- |
| name      | Filter project   |
| page      | Pagination       |
| limit     | Results per page |

Example

```
/employee/projects?name=workflow&page=1&limit=10
```

---

## Get Single Project

**GET**

```
/employee/projects/:projectId
```

Example

```
/employee/projects/69ac59c19f5a365fa6abc30f
```

---

# 👨‍💻 Employee Task APIs

## Get Tasks by Project

**GET**

```
/employee/tasks/:projectId
```

### Query Parameters

| Parameter | Description        |
| --------- | ------------------ |
| status    | Filter by status   |
| priority  | Filter by priority |

Example

```
/employee/tasks/69ac59c19f5a365fa6abc30f?status=Review&priority=High
```

---

# 📂 Project Structure

```
controllers/
models/
middleware/

routes/
   admin_manager/
   user/


routings/
   admin_manager.js
   user.js

config/
   db.js

app.js
server.js
```

---

# ▶️ Run Project

Install dependencies

```
npm install
```

Run server

```
npm run dev
```

or

```
npx nodemon server.js
```

Server will run on

```
http://localhost:3001
```

---

# 📑 API Documentation

Swagger Documentation

```
http://localhost:3001/api-docs
```

---

# 👨‍💻 Author

**Akhilesh Soni**
Node.js Backend Developer
