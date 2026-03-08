const express = require("express");

const admin = express();

const admin_managerProjectRoute = require("../routes/admin_manager/projectRoutes");

const admin_managerUsersRoute = require("../routes/admin_manager/usersRelatedRoute");

const admin_managerTaskRoute = require("../routes/admin_manager/taskRoute");

admin.use("/users", admin_managerUsersRoute);

admin.use("/projects", admin_managerProjectRoute);

admin.use("/tasks", admin_managerTaskRoute);

module.exports = admin;
