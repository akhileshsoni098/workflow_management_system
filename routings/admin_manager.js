const express = require("express")

const admin = express()

const admin_managerProjectRoute = require("../routes/admin_manager/projectRoutes")

const admin_managerUsersRoute = require("../routes/admin_manager/usersRelatedRoute")

admin.use("/projects",admin_managerProjectRoute)

admin.use("/users",admin_managerUsersRoute)


module.exports = admin