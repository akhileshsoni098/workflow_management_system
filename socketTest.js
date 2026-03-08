const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:3001";
const PROJECT_ID = "69ac59c19f5a365fa6abc30f"; 

const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // join project room
  console.log(`📌 Joining project room: ${PROJECT_ID}`);
  socket.emit("joinProject", PROJECT_ID);
});


// ================= GLOBAL PROJECT EVENTS =================

socket.on("projectCreated", (project) => {
  console.log("🟢 Project Created:", project);
});

socket.on("projectUpdated", (project) => {
  console.log("🟡 Project Updated:", project);
});

socket.on("projectDeleted", (data) => {
  console.log("🔴 Project Deleted:", data);
});

socket.on("projectUsersAssigned", (project) => {
  console.log("👥 Users Assigned to Project:", project);
});


// ================= PROJECT ROOM TASK EVENTS =================

socket.on("taskCreated", (task) => {
  console.log("📌 Task Created:", task);
});

socket.on("taskUpdated", (task) => {
  console.log("✏️ Task Updated:", task);
});

socket.on("taskStatusChanged", (task) => {
  console.log("🔄 Task Status Changed:", task);
});

socket.on("taskDeleted", (data) => {
  console.log("❌ Task Deleted:", data);
});


// ================= DISCONNECT =================

socket.on("disconnect", () => {
  console.log("⚠️ Disconnected from server");
});