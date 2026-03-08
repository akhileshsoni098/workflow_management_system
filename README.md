# Workflow Management System

A **Node.js + Express + MongoDB** based backend API for managing internal company workflows, projects, and tasks.

The system supports **Admin / Manager / Employee roles** with secure **JWT authentication**, project management, and task tracking.

---

## 📘 API Documentation

The complete API documentation is available using **Swagger UI**.

🔗 **Live Swagger Documentation:**
👉 https://workflow-management-system-4spr.onrender.com/api-docs/

You can use this interface to:

* Explore all available API endpoints
* View request and response formats
* Test APIs directly from the browser
* Add authentication headers (`x-auth-token`) to protected routes

---




---

# 🚀 Features

- User Authentication (Register & Login)
- Role Based Access Control (Admin / Manager / Employee)
- Project Creation & Management
- Assign Users to Projects
- Task Creation & Management
- Task Status Tracking
- Pagination & Filtering
- JWT Based Authentication
- RESTful API Architecture
- Real-time Event System using **Socket.IO**
- Project Room Based Real-time Updates
- Live Notifications for Project and Task Events
- Redis Integration for Performance Optimization

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


# 🔌 Socket Client Documentation

The system supports **Socket.IO based event notifications** for project and task related activities.
Clients can connect to the backend server and listen for events in real time.

---

# 📡 Socket Server URL

```
http://localhost:3001
```

---

# 📦 Install Socket Client

```
npm install socket.io-client
```

---

# 🔗 Connect to Socket Server

```
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:3001";
const PROJECT_ID = "PROJECT_ID";

const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Join project room
  socket.emit("joinProject", PROJECT_ID);
});
```

---

# 🏢 Project Room System

Each project acts as a **socket room**.

Clients join a project room using:

```
socket.emit("joinProject", PROJECT_ID);
```

This ensures that only users assigned to the project receive project-specific events.

---

# 🌍 Global Project Events

These events are broadcast to all connected clients.

### Project Created

```
socket.on("projectCreated", (project) => {
  console.log("Project Created:", project);
});
```

### Project Updated

```
socket.on("projectUpdated", (project) => {
  console.log("Project Updated:", project);
});
```

### Project Deleted

```
socket.on("projectDeleted", (data) => {
  console.log("Project Deleted:", data);
});
```

### Users Assigned to Project

```
socket.on("projectUsersAssigned", (project) => {
  console.log("Users Assigned:", project);
});
```

---

# 📁 Project Room Task Events

These events are emitted only to users inside the project room.

### Task Created

```
socket.on("taskCreated", (task) => {
  console.log("Task Created:", task);
});
```

### Task Updated

```
socket.on("taskUpdated", (task) => {
  console.log("Task Updated:", task);
});
```

### Task Status Changed

```
socket.on("taskStatusChanged", (task) => {
  console.log("Task Status Changed:", task);
});
```

### Task Deleted

```
socket.on("taskDeleted", (data) => {
  console.log("Task Deleted:", data);
});
```

---

# ⚠️ Disconnect Event

```
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

---

# 🧪 Local Testing

Run the socket test client:

```
node socketTest.js
```

Then trigger API actions such as:

* Create Project
* Update Project
* Assign Users
* Create Task
* Update Task

The corresponding socket events will appear in the terminal.



# 👨‍💻 Author

**Akhilesh Soni**
Node.js Backend Developer
