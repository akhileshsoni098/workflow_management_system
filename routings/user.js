const express = require("express")

const user = express()

const userAuthRoute = require("../routes/user/userAuthRoute")

const empProjectRoute = require("../routes/user/empProjectRoute")

const empTaskRoute = require("../routes/user/empTaskRoute")

user.use("/user",userAuthRoute)

user.use("/employee/projects",empProjectRoute)

user.use("/employee/tasks",empTaskRoute)


module.exports = user