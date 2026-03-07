const express = require("express")

const user = express()

const userAuthRoute = require("../routes/user/userAuthRoute")

const empProjectRoute = require("../routes/user/empProjectRoute")




user.use("/user",userAuthRoute)

user.use("/employee/projects",empProjectRoute)


module.exports = user